'use strict'
const Lab = require('lab')
const Code = require('code')
const cls = require('continuation-local-storage')

const BaseMetricWorker = require('workers/base.metric.worker')
const MetricTracker = require('models/metric-tracker')
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
  it('should return false', (done) => {
    const worker = new BaseMetricWorker()
    const result = worker._shouldIgnore()
    expect(result).to.be.false()
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
    let clsGetStub
    beforeEach((done) => {
      clsGetStub = sinon.stub()
      sinon.stub(BaseMetricWorker.prototype, '_shouldIgnore')
      sinon.stub(BaseMetricWorker.prototype, '_parseTags')
      sinon.stub(cls, 'getNamespace').returns({
        get: clsGetStub
      })
      sinon.stub(MetricTracker, 'track').resolves()
      done()
    })

    afterEach((done) => {
      BaseMetricWorker.prototype._shouldIgnore.restore()
      BaseMetricWorker.prototype._parseTags.restore()
      cls.getNamespace.restore()
      MetricTracker.track.restore()
      done()
    })

    it('should return if _shouldIgnore returns true', (done) => {
      BaseMetricWorker.prototype._shouldIgnore.returns(true)
      const worker = new BaseMetricWorker(job, meta)
      worker.task()
      sinon.assert.notCalled(MetricTracker.track)
      done()
    })

    it('should call MetricTracker.track', (done) => {
      clsGetStub.returns('container.started')
      BaseMetricWorker.prototype._shouldIgnore.returns(false)
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
        sinon.assert.calledOnce(cls.getNamespace)
        sinon.assert.calledWith(cls.getNamespace, 'ponos')
        done()
      }).catch(done)
    })

    it('should call all functions in order', (done) => {
      clsGetStub.returns('container.started')
      BaseMetricWorker.prototype._shouldIgnore.returns(false)
      BaseMetricWorker.prototype._parseTags.returns({
        instanceId: 'inst-1',
        githubOrgId: 1234
      })
      const worker = new BaseMetricWorker(job, meta)
      worker.task().then(() => {
        sinon.assert.calledOnce(BaseMetricWorker.prototype._shouldIgnore)
        sinon.assert.calledOnce(BaseMetricWorker.prototype._parseTags)
        sinon.assert.calledOnce(MetricTracker.track)
        sinon.assert.callOrder(
          BaseMetricWorker.prototype._shouldIgnore,
          BaseMetricWorker.prototype._parseTags,
          MetricTracker.track
        )
        done()
      }).catch(done)
    })
  })
})
