'use strict'
require('loadenv')()
const joi = require('joi')
const url = require('url')

const MetricTracker = require('models/metric-tracker')

class Worker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  _getEventName () {
    const eventType = this.job.inspectData.Config.Labels.type
    if (eventType === 'image-builder-container') {
      return 'container.image-builder.started'
    } else if (eventType === 'user-container') {
      return 'instance.container.started'
    }

    return null
  }

  static parseTags (job) {
    return {
      branchName: job.inspectData.Config.Labels.instanceName,
      dockerHostIp: url.parse(job.host).hostname,
      githubOrgId: job.inspectData.Config.Labels.githubOrgId,
      githubUserId: job.inspectData.Config.Labels.sessionUserGithubId,
      isManual: job.inspectData.Config.Labels.manualBuild
    }
  }
  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this._getEventName()

    if (!eventName) { return }
    const mainData = {
      eventName: eventName,
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

  task: (job) => {
    const worker = new Worker(job)
    return worker.task()
  },

  parseTags: (job) => {
    return Worker.parseTags(job)
  },

  jobSchema: joi.object({
    host: joi.string().uri({ scheme: 'http' }).required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          githubOrgId: joi.number().required(),
          instanceName: joi.string().required(),
          manualBuild: joi.string().required(),
          sessionUserGithubId: joi.number().required(),
          type: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required().label('container.image-builder.died job')
}
