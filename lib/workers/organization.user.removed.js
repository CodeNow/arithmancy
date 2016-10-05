'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.user.removed'
  }

  static parseTags (job) {
    return {
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker,
  joi.object({
    organization: joi.object({
      id: joi.number().required(),
      githubId: joi.number().required()
    }).required(),
    user: joi.object({
      id: joi.number().required(),
      githubId: joi.number().required()
    }).required()
  }).unknown().required()
)