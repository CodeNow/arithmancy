'use strict'
const Lab = require('lab')

const MetricTracker = require('models/metric-tracker')
const WorkerErrored = require('workers/worker.errored')
const ContainerLifeCycleStarted = require('workers/container.life-cycle.started')

const sinon = require('sinon')
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('worker.errored', () => {
  const job = {
    originalJobPayload: {
      host: 'http://127.0.0.1:4242',
      inspectData: {
        Config: {
          Labels: {
            githubOrgId: 123123,
            sessionUserGithubId: 99999,
            manualBuild: false,
            instanceName: 'api'
          }
        }
      }
    },
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
    tx: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
  }
  beforeEach((done) => {
    sinon.spy(WorkerErrored._Worker.prototype, 'task')
    sinon.stub(MetricTracker, 'track')
    sinon.spy(ContainerLifeCycleStarted, 'parseTags')
    done()
  })

  afterEach((done) => {
    WorkerErrored._Worker.prototype.task.restore()
    MetricTracker.track.restore()
    ContainerLifeCycleStarted.parseTags.restore()
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
      isSuccess: false,
      previousEventName: job.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: job.tx
    })
    done()
  })

  it('should call container.life-cycle.started parse tags', (done) => {
    const containerStartedJob = Object.assign({}, job, {
      originalWorkerName: 'container.life-cycle.started'
    })
    WorkerErrored.task(containerStartedJob, meta)
    sinon.assert.calledOnce(ContainerLifeCycleStarted.parseTags)
    sinon.assert.calledWithExactly(ContainerLifeCycleStarted.parseTags, containerStartedJob.originalJobPayload)
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      appName: meta.appId,
      branchName: containerStartedJob.originalJobPayload.inspectData.Config.Labels.instanceName,
      dockerHostIp: '127.0.0.1',
      eventName: containerStartedJob.originalWorkerName,
      githubOrgId: containerStartedJob.originalJobPayload.inspectData.Config.Labels.githubOrgId,
      githubUserId: containerStartedJob.originalJobPayload.inspectData.Config.Labels.sessionUserGithubId,
      isSuccess: false,
      isManual: containerStartedJob.originalJobPayload.inspectData.Config.Labels.manualBuild,
      previousEventName: containerStartedJob.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: containerStartedJob.tx
    })
    done()
  })
})
