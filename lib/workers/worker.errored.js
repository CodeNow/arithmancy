'use strict'
require('loadenv')()

const joi = require('joi')
const keypather = require('keypather')()

const MetricTracker = require('models/metric-tracker')

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
    const eventName = this.job.originalWorkerName + '.errored'
    const mainData = {
      eventName: eventName,
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tx,
      previousEventName: keypather.get(this, 'job.originalJobMeta.headers.publisherWorkerName')
    }
    let tags
    switch (this.job.originalWorkerName) {
      case 'container.life-cycle.started':
        tags = require('./container.life-cycle.started').parseTags(this.job.originalJobPayload)
        break
      default:
        {}
    }
    return MetricTracker.track(Object.assign({}, mainData, tags))
  }
}

module.exports = {
  _Worker: Worker,

  task: (job) => {
    const worker = new Worker(job)
    return worker.task()
  },

  jobSchema: joi.object({
    originalJobPayload: joi.object().unknown().required(),
    originalJobMeta: joi.object().unknown().required(),
    originalWorkerName: joi.string().required(),
    error: joi.object().required()
  }).unknown()
}
