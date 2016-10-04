'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')

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
    organization: joi.object({
      id: joi.number().required()
    }).required()
  }).unknown().required().label('organization.integration.prbot.enabled job')
}
