'use strict'
require('loadenv')()
const joi = require('joi')
const keypather = require('keypather')()
const url = require('url')

const BaseMetricWorker = require('workers/base.metric.worker')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    const eventType = keypather.get(this, 'job.inspectData.Config.Labels.type')
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
      githubOrgId: parseInt(job.inspectData.Config.Labels.githubOrgId, 10),
      githubUserId: parseInt(job.inspectData.Config.Labels.sessionUserGithubId, 10),
      isManualBuild: Worker._isManualBuild(job)
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }

  /**
   * @return {Boolean|undefined}
   */
  static _isManualBuild (job) {
    switch (job.inspectData.Config.Labels.manualBuild) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return undefined
    }
  }
}

module.exports = workerGenerator(Worker, joi.object({
  host: joi.string().uri({ scheme: 'http' }).required(),
  inspectData: joi.object({
    Config: joi.object({
      Labels: joi.object({
        githubOrgId: joi.number()
          .when('type', { is: joi.string(), then: joi.required() }),
        instanceName: joi.string()
          .when('type', { is: 'user-container', then: joi.required() }),
        manualBuild: joi.string()
          .when('type', { is: 'image-builder-container', then: joi.required() }),
        sessionUserGithubId: joi.number()
          .when('type', { is: joi.string(), then: joi.required() }),
        type: joi.string()
      }).unknown()
    }).unknown()
  }).unknown()
}).unknown().required().label('container.image-builder.died job'))
