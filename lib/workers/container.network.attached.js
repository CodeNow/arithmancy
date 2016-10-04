'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'container.network.attached'
  }

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
    id: joi.string().required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          githubOrgId: joi.number().required(),
          instanceId: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required().label('container.network.attached job')
}
