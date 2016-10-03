'use strict'
require('loadenv')()
const joi = require('joi')
const url = require('url')

const BaseMetricWorker = require('workers/base.metric.worker')

class Worker extends BaseMetricWorker {
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
      isManualBuild: job.inspectData.Config.Labels.manualBuild
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
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
          manualBuild: joi.boolean().required(),
          sessionUserGithubId: joi.number().required(),
          type: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required().label('container.image-builder.started job')
}
