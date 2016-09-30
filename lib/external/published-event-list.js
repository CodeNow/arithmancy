'use strict'
const joi = require('joi')

module.exports = [{
  name: 'container.life-cycle.started',
  jobSchema: joi.object({
    host: joi.string().uri({ scheme: 'http' }).required(),
    inspectData: joi.object({
      Config: joi.object({
        Labels: joi.object({
          githubOrgId: joi.number().required(),
          instanceName: joi.string().required(),
          manualBuild: joi.string().required(),
          sessionUserGithubId: joi.number().required(),
          type: joi.string().required()
        }).unknown().required()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required()
}]
