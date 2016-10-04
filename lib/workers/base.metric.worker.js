'use strict'
require('loadenv')()

const MetricTracker = require('models/metric-tracker')
const WorkerStopError = require('error-cat/errors/worker-stop-error')

module.exports = class MetricWorker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  _getEventName () {
    throw new Error('Should be implemented')
  }

  _parseTags () {
    throw new Error('Should be implemented')
  }

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this._getEventName()
    if (!eventName) {
      throw new WorkerStopError('Event name is required')
    }
    const mainData = {
      eventName: eventName,
      appName: process.env.APP_NAME,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: this.meta.headers.publisherWorkerName
    }
    const tags = this._parseTags()
    return MetricTracker.track(Object.assign({}, mainData, tags))
  }
}
