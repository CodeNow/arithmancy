'use strict'
const Lab = require('lab')
const Code = require('code')

const BaseMetricWorker = require('workers/base.metric.worker')
const WorkerStopError = require('error-cat/errors/worker-stop-error')
const sinon = require('sinon')

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
    tx: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
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
      done()
    })
    afterEach((done) => {
      BaseMetricWorker.prototype._getEventName.restore()
      done()
    })
    it('should throw if _getEventName returns null', (done) => {
      BaseMetricWorker.prototype._getEventName.returns(null)
      const worker = new BaseMetricWorker(job, meta)
      expect(worker.task.bind(worker)).to.throw(WorkerStopError, 'Event name is required')
      done()
    })
  })
})
