'use strict'
require('loadenv')()

const joi = require('joi')
const keypather = require('keypather')()

const MetricTracker = require('models/metric-tracker')
const workerGenerator = require('workers/worker-generator')

class Worker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this.job.originalWorkerName
    const mainData = {
      eventName: eventName,
      appName: process.env.APP_NAME,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: keypather.get(this, 'job.originalJobMeta.headers.publisherWorkerName')
    }
    let tags
    switch (this.job.originalWorkerName) {
      case 'container.life-cycle.started':
        tags = require('./container.life-cycle.started').parseTags(this.job.originalJobPayload)
        break
      case 'container.network.attached':
        tags = require('./container.network.attached').parseTags(this.job.originalJobPayload)
        break
      default:
        {}
    }
    return MetricTracker.track(Object.assign({}, mainData, tags, { isWorkerSuccessfull: false }))
  }
}

module.exports = workerGenerator(Worker, joi.object({
  originalJobPayload: joi.object().unknown().required(),
  originalJobMeta: joi.object().unknown().required(),
  originalWorkerName: joi.string().required(),
  error: joi.object().required()
}).unknown())
