'use strict'
require('loadenv')()
const joi = require('joi')

const BaseMetricWorker = require('workers/base.metric.worker')
const jobParser = require('utils/job-parser')
const validators = require('utils/validators')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return jobParser.getEventName(this.job)
  }

  static parseTags (job) {
    return jobParser.parseContainerLifeCycleJob(job)
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, joi.object({
  host: joi.string().uri({ scheme: 'http' }).required(),
  inspectData: joi.object({
    Config: joi.object({
      Labels: joi.object({
        githubOrgId: validators.requiredNumberIfValidType(),
        instanceName: joi.string()
          .when('type', { is: 'user-container', then: joi.required() }),
        manualBuild: joi.string()
          .when('type', { is: 'image-builder-container', then: joi.required() }),
        sessionUserGithubId: validators.requiredNumberIfValidType(),
        type: validators.validType()
      }).unknown()
    }).unknown()
  }).unknown()
}).unknown().required().label('container.image-builder.died job'))
