'use strict'
const Lab = require('lab')
const Code = require('code')

const BaseMetricWorker = require('workers/base.metric.worker')
const MetricTracker = require('models/metric-tracker')
const WorkerStopError = require('error-cat/errors/worker-stop-error')
const sinon = require('sinon')
require('sinon-as-promised')(require('bluebird'))

const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('base.metric.worker', () => {
  const job = {
    id: 'container-id-1',
    inspectData: {
      Config: {
        Labels: {
          githubOrgId: 123123,
          instanceId: 'some-instance-id'
        }
      }
    },
    tid: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now(),
    headers: {
      publisherWorkerName: 'container.create'
    }
  }
  it('should throw because _getEventName is not implemented', (done) => {
    const worker = new BaseMetricWorker()
    expect(worker._getEventName).to.throw(Error, /Should be implemented/)
    done()
  })

  it('should throw because _parseTags is not implemented', (done) => {
    const worker = new BaseMetricWorker()
    expect(worker._parseTags).to.throw(Error, /Should be implemented/)
    done()
  })

  it('should be properly initialized', (done) => {
    const worker = new BaseMetricWorker(job, meta)
    expect(worker.job).to.equal(job)
    expect(worker.meta).to.equal(meta)
    done()
  })

  describe('task', () => {
    beforeEach((done) => {
      sinon.stub(BaseMetricWorker.prototype, '_getEventName')
      sinon.stub(BaseMetricWorker.prototype, '_parseTags')
      sinon.stub(MetricTracker, 'track').resolves()
      done()
    })
    afterEach((done) => {
      BaseMetricWorker.prototype._getEventName.restore()
      BaseMetricWorker.prototype._parseTags.restore()
      MetricTracker.track.restore()
      done()
    })
    it('should throw if _getEventName returns null', (done) => {
      BaseMetricWorker.prototype._getEventName.returns(null)
      const worker = new BaseMetricWorker(job, meta)
      expect(worker.task.bind(worker)).to.throw(WorkerStopError, 'Event name is required')
      done()
    })

    it('should call MetricTracker.track', (done) => {
      BaseMetricWorker.prototype._getEventName.returns('container.started')
      BaseMetricWorker.prototype._parseTags.returns({
        instanceId: 'inst-1',
        githubOrgId: 1234
      })
      const worker = new BaseMetricWorker(job, meta)
      worker.task().then(() => {
        sinon.assert.calledOnce(MetricTracker.track)
        sinon.assert.calledWithExactly(MetricTracker.track, {
          appName: meta.appId,
          eventName: 'container.started',
          githubOrgId: 1234,
          instanceId: 'inst-1',
          previousEventName: 'container.create',
          timePublished: new Date(meta.timestamp),
          timeRecevied: sinon.match.date,
          transactionId: job.tid
        })
        done()
      }).catch(done)
    })

    it('should call all funcstions in order', (done) => {
      BaseMetricWorker.prototype._getEventName.returns('container.started')
      BaseMetricWorker.prototype._parseTags.returns({
        instanceId: 'inst-1',
        githubOrgId: 1234
      })
      const worker = new BaseMetricWorker(job, meta)
      worker.task().then(() => {
        sinon.assert.calledOnce(BaseMetricWorker.prototype._getEventName)
        sinon.assert.calledOnce(BaseMetricWorker.prototype._parseTags)
        sinon.assert.calledOnce(MetricTracker.track)
        sinon.assert.callOrder(
          BaseMetricWorker.prototype._getEventName,
          BaseMetricWorker.prototype._parseTags,
          MetricTracker.track
        )
        done()
      }).catch(done)
    })
  })
})
