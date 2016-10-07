'use strict'
require('loadenv')()
const cls = require('continuation-local-storage')

const MetricTracker = require('models/metric-tracker')
const jobParser = require('utils/job-parser')

module.exports = class MetricWorker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const workerName = cls.getNamespace('ponos').get('currentWorkerName')
    const mainData = {
      eventName: workerName,
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: this.meta.headers.publisherWorkerName
    }
    const tags = jobParser.parseWorkerJob(workerName, this.job)
    return MetricTracker.track(Object.assign({}, mainData, tags))
  }
}
