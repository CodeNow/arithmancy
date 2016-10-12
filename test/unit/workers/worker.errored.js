'use strict'
const Lab = require('lab')

const jobParser = require('utils/job-parser')
const MetricTracker = require('models/metric-tracker')
const WorkerErrored = require('workers/worker.errored')

const sinon = require('sinon')
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('worker.errored', () => {
  const testOrignialPayload = {
    Prior: 'Incantato'
  }
  const job = {
    originalJobPayload: testOrignialPayload,
    originalJobMeta: {
      appId: 'api',
      headers: {
        publisherWorkerName: 'instance.create'
      }
    },
    originalWorkerName: 'instance.created',
    error: {
      msg: 'Failed to start'
    },
    tid: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
  }

  beforeEach((done) => {
    sinon.spy(WorkerErrored._Worker.prototype, 'task')
    sinon.stub(MetricTracker, 'track')
    sinon.stub(jobParser, 'parseWorkerJob')
    done()
  })

  afterEach((done) => {
    jobParser.parseWorkerJob.restore()
    WorkerErrored._Worker.prototype.task.restore()
    MetricTracker.track.restore()
    done()
  })

  it('should call _Worker.task', (done) => {
    WorkerErrored.task(job, meta)
    sinon.assert.calledOnce(WorkerErrored._Worker.prototype.task)
    sinon.assert.calledWithExactly(WorkerErrored._Worker.prototype.task)
    done()
  })

  it('should call MetricTracker.track', (done) => {
    WorkerErrored.task(job, meta)
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      appName: meta.appId,
      eventName: job.originalWorkerName,
      isWorkerSuccessfull: false,
      previousEventName: job.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: job.tid
    })
    done()
  })

  it('should call container.life-cycle.started parse tags', (done) => {
    const containerStartedJob = Object.assign({}, job, {
      originalWorkerName: 'container.life-cycle.started'
    })
    jobParser.parseWorkerJob.returns(testOrignialPayload)

    WorkerErrored.task(containerStartedJob, meta)
    sinon.assert.calledOnce(jobParser.parseWorkerJob)
    sinon.assert.calledWith(jobParser.parseWorkerJob,
      containerStartedJob.originalWorkerName,
      containerStartedJob.originalJobPayload
    )
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      Prior: testOrignialPayload.Prior,
      appName: meta.appId,
      eventName: containerStartedJob.originalWorkerName,
      isWorkerSuccessfull: false,
      previousEventName: containerStartedJob.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: containerStartedJob.tid
    })
    done()
  })

  it('should not parse tags if parser not found', (done) => {
    const containerStartedJob = Object.assign({}, job, {
      originalWorkerName: 'fake-parser'
    })
    jobParser.parseWorkerJob.returns(testOrignialPayload)

    WorkerErrored.task(containerStartedJob, meta)
    sinon.assert.notCalled(jobParser.parseWorkerJob)
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      appName: meta.appId,
      eventName: containerStartedJob.originalWorkerName,
      isWorkerSuccessfull: false,
      previousEventName: containerStartedJob.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: containerStartedJob.tid
    })
    done()
  })
})
