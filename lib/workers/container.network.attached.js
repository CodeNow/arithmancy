'use strict'
require('loadenv')()
const joi = require('joi')

const MetricTracker = require('models/metric-tracker')

class Worker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  static parseTags (job) {
    return {
      containerId: job.id,
      githubOrgId: job.inspectData.Config.Labels.githubOrgId,
      instanceId: job.inspectData.Config.Labels.instanceId
    }
  }
  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const mainData = {
      eventName: 'container.network.attached',
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: this.meta.headers.publisherWorkerName
    }
    const tags = Worker.parseTags(this.job)
    return MetricTracker.track(Object.assign({}, mainData, tags))
  }
}

module.exports = {
  _Worker: Worker,

  task: (job, meta) => {
    const worker = new Worker(job, meta)
    return worker.task()
  },

  parseTags: (job) => {
    return Worker.parseTags(job)
  },

  jobSchema: joi.object({
    id: joi.string().required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          githubOrgId: joi.number().required(),
          instanceId: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required().label('container.network.attached job')
}
