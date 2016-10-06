'use strict'
const Lab = require('lab')

const MetricTracker = require('models/metric-tracker')
const WorkerErrored = require('workers/worker.errored')
const ContainerLifeCycle = require('workers/container.life-cycle')
const ContainerNetworkStarted = require('workers/container.network.attached')

const sinon = require('sinon')
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('worker.errored', () => {
  const job = {
    originalJobPayload: {
      id: '068a664de33cf2103f034c037ed93c571252a80a30231c04d748826643ab1a55',
      needsInspect: true,
      host: 'http://127.0.0.1:4242',
      inspectData: {
        Config: {
          Labels: {
            githubOrgId: 123123,
            sessionUserGithubId: 99999,
            manualBuild: 'false',
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
    tid: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
  }
  beforeEach((done) => {
    sinon.spy(WorkerErrored._Worker.prototype, 'task')
    sinon.stub(MetricTracker, 'track')
    sinon.spy(ContainerLifeCycle, 'parseTags')
    sinon.spy(ContainerNetworkStarted, 'parseTags')
    done()
  })

  afterEach((done) => {
    WorkerErrored._Worker.prototype.task.restore()
    MetricTracker.track.restore()
    ContainerLifeCycle.parseTags.restore()
    ContainerNetworkStarted.parseTags.restore()
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
    WorkerErrored.task(containerStartedJob, meta)
    sinon.assert.calledOnce(ContainerLifeCycle.parseTags)
    sinon.assert.calledWithExactly(ContainerLifeCycle.parseTags, containerStartedJob.originalJobPayload)
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      appName: meta.appId,
      branchName: containerStartedJob.originalJobPayload.inspectData.Config.Labels.instanceName,
      containerId: containerStartedJob.originalJobPayload.id,
      dockerHostIp: '127.0.0.1',
      eventName: containerStartedJob.originalWorkerName,
      githubOrgId: containerStartedJob.originalJobPayload.inspectData.Config.Labels.githubOrgId,
      githubUserId: containerStartedJob.originalJobPayload.inspectData.Config.Labels.sessionUserGithubId,
      isWorkerSuccessfull: false,
      isManualBuild: false,
      previousEventName: containerStartedJob.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: containerStartedJob.tid
    })
    done()
  })

  it('should call container.network.attached parse tags', (done) => {
    const containerNetworkAttached = Object.assign({}, job, {
      originalWorkerName: 'container.network.attached',
      originalJobPayload: {
        id: 'containerid-1',
        inspectData: {
          Config: {
            Labels: {
              instanceId: 'inst-1',
              githubOrgId: 88888
            }
          }
        }
      }
    })
    WorkerErrored.task(containerNetworkAttached, meta)
    sinon.assert.calledOnce(ContainerNetworkStarted.parseTags)
    sinon.assert.calledWithExactly(ContainerNetworkStarted.parseTags, containerNetworkAttached.originalJobPayload)
    sinon.assert.calledOnce(MetricTracker.track)
    sinon.assert.calledWithExactly(MetricTracker.track, {
      appName: meta.appId,
      containerId: containerNetworkAttached.originalJobPayload.id,
      eventName: containerNetworkAttached.originalWorkerName,
      githubOrgId: containerNetworkAttached.originalJobPayload.inspectData.Config.Labels.githubOrgId,
      instanceId: containerNetworkAttached.originalJobPayload.inspectData.Config.Labels.instanceId,
      isWorkerSuccessfull: false,
      previousEventName: containerNetworkAttached.originalJobMeta.headers.publisherWorkerName,
      timePublished: new Date(meta.timestamp),
      timeRecevied: sinon.match.date,
      transactionId: containerNetworkAttached.tid
    })
    done()
  })
})
