'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const v = require('utils/validators')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'user.whitelisted'
  }

  static parseTags (job) {
    return {
      githubOrgId: parseInt(job.githubId, 10)
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, joi.object({
  githubId: v.requiredNumber()
}).unknown().required())
