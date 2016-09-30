'use strict'
require('loadenv')()
const cls = require('continuation-local-storage')
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

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this._getEventName()

    if (!eventName) { return }

    return MetricTracker.track({
      eventName: eventName,
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: cls.getNamespace('ponos').get('tid'),
      previousEventName: this.meta.headers.publisherWorkerName,
      // tags
      branchName: this.job.inspectData.Config.Labels.instanceName,
      dockerHostIp: url.parse(this.job.host).hostname,
      githubOrgId: parseInt(this.job.inspectData.Config.Labels.githubOrgId, 10),
      githubUserId: parseInt(this.job.inspectData.Config.Labels.sessionUserGithubId, 10),
      isManual: this.job.inspectData.Config.Labels.manualBuild
    })
  }
}

module.exports = {
  _Worker: Worker,

  task: (job) => {
    const worker = new Worker(job)
    return worker.task()
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
