'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.created'
  }

  static parseTags (job) {
    return {
      bigPoppaOrgId: job.organization.id,
      githubOrgId: job.organization.githubId,
      githubUserId: job.creator.githubId
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
      githubId: joi.number().required(),
      name: joi.string().required()
    }).required(),
    creator: joi.object({
      githubId: joi.number().required(),
      githubUsername: joi.string().required()
    }).unknown().required()
  }).unknown().required()
)
