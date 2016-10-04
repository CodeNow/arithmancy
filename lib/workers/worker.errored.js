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
  _parseTags (jobName) {
    const workerFile = 'workers/' + jobName
    return require(workerFile).parseTags(this.job.originalJobPayload)
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
    const jobs = [
      'container.life-cycle.started',
      'container.network.attached',
      'organization.integration.prbot.enabled'
    ]
    const tags = jobs.indexOf(this.job.originalWorkerName) > -1 ? this._parseTags(this.job.originalWorkerName) : {}
    return MetricTracker.track(Object.assign({}, mainData, tags, { isWorkerSuccessfull: false }))
  }
}

module.exports = {
  _Worker: Worker,

  task: (job, meta) => {
    const worker = new Worker(job, meta)
    return worker.task()
  },

  jobSchema: joi.object({
    originalJobPayload: joi.object().unknown().required(),
    originalJobMeta: joi.object().unknown().required(),
    originalWorkerName: joi.string().required(),
    error: joi.object().required()
  }).unknown()
}
