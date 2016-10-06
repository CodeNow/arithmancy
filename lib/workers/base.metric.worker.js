'use strict'
require('loadenv')()
const cls = require('continuation-local-storage')

const MetricTracker = require('models/metric-tracker')

module.exports = class MetricWorker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  _shouldIgnore () {
    return false
  }

  _parseTags () {
    throw new Error('Should be implemented')
  }

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    // only return here to stop noisy errors logs
    if (this._shouldIgnore()) { return }

    const mainData = {
      eventName: cls.getNamespace('ponos').get('currentWorkerName'),
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: this.meta.headers.publisherWorkerName
    }
    const tags = this._parseTags()
    return MetricTracker.track(Object.assign({}, mainData, tags))
  }
}
