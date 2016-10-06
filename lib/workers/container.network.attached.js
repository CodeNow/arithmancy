'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  static parseTags (job) {
    return {
      containerId: job.id,
      githubOrgId: job.inspectData.Config.Labels.githubOrgId,
      instanceId: job.inspectData.Config.Labels.instanceId
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker,
  joi.object({
    id: joi.string().required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          githubOrgId: joi.number().required(),
          instanceId: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required()
)
