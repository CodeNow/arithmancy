'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.integration.prbot.enabled'
  }

  static parseTags (job) {
    return {
      bigPoppaOrgId: job.organization.id
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker,
  joi.object({
    organization: joi.object({
      id: joi.number().required()
    }).required()
  }).unknown().required()
)
