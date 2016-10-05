'use strict'
require('loadenv')()

const joi = require('joi')
const keypather = require('keypather')()
const subscribedEvents = require('external/subscribed-event-list')
const MetricTracker = require('models/metric-tracker')
const workerGenerator = require('workers/worker-generator')
const workerRequire = require('utils/worker-require')

class Worker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  _parseTags (jobName) {
    return workerRequire(jobName).parseTags(this.job.originalJobPayload)
  }
  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this.job.originalWorkerName
    const mainData = {
      eventName: eventName,
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: keypather.get(this, 'job.originalJobMeta.headers.publisherWorkerName')
    }
    const tags = subscribedEvents.indexOf(this.job.originalWorkerName) > -1 ? this._parseTags(this.job.originalWorkerName) : {}
    return MetricTracker.track(Object.assign({}, mainData, tags, { isWorkerSuccessfull: false }))
  }
}

module.exports = workerGenerator(Worker, joi.object({
  originalJobPayload: joi.object().unknown().required(),
  originalJobMeta: joi.object().unknown().required(),
  originalWorkerName: joi.string().required(),
  error: joi.object().required()
}).unknown())
