'use strict'
require('loadenv')()
const cls = require('continuation-local-storage')
const joi = require('utils/joi')
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
      githubOrgId: this.job.inspectData.Config.Labels.githubOrgId,
      githubUserId: this.job.inspectData.Config.Labels.sessionUserGithubId,
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
    from: joi.string().required(),
    host: joi.string().uri({ scheme: 'http' }).required(),
    id: joi.string().required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          'contextVersion.build._id': joi.string().required(),
          'ownerUsername': joi.string().required(),
          'sessionUserGithubId': joi.number().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required().label('container.image-builder.died job')
}
