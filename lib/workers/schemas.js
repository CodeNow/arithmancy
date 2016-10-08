'use strict'
const joi = require('joi')
const stringcase = require('stringcase')

const validators = require('utils/validators')

exports.requiredGithubId = joi.object({
  githubId: validators.requiredNumber()
}).unknown().required()

exports.requiredGithubAndBigPoppaId = joi.object({
  id: validators.requiredNumber(),
  githubId: validators.requiredNumber()
}).required()

exports.requiredIdNumber = joi.object({
  id: validators.requiredNumber()
}).required()

exports.dockEvent = joi.object({
  githubOrgId: validators.requiredNumber(),
  host: joi.string().uri({ scheme: 'http' }).required()
}).unknown().required()

exports.orgPaymentMethodAddedRemoved = exports.organizationInvoicePaymentFailed = joi.object({
  organization: joi.object({
    id: validators.requiredNumber()
  }).unknown().required(),
  paymentMethodOwner: joi.object({
    githubId: validators.requiredNumber()
  }).unknown().required()
}).unknown().required()

exports.orgUserAddedRemoved = joi.object({
  organization: exports.requiredGithubAndBigPoppaId,
  user: exports.requiredGithubAndBigPoppaId
}).unknown().required()

exports.trialEvent = joi.object({
  organization: exports.requiredIdNumber
}).unknown().required()

exports.instanceEvents = joi.object({
  instance: joi.object({
    id: validators.requiredString(),
    owner: joi.object({
      github: validators.requiredNumber()
    }).unknown().required(),
    contextVersion: joi.object({
      id: validators.requiredString(),
      appCodeVersions: joi.array().items(
        joi.object({
          repo: validators.requiredString(),
          branch: validators.requiredString()
        }).unknown()
      ).required()
    }).unknown().required()
  }).unknown().required()
}).unknown().required()

exports.apiDockEvent = joi.object({
  githubId: validators.requiredNumber(),
  dockerHostIp: joi.string().ip().required()
}).unknown().required()

exports.organizationAuthorized = joi.object({
  githubId: validators.requiredNumber(),
  creator: joi.object({
    githubId: validators.requiredNumber()
  }).unknown().required()
}).unknown().required()

exports.containerLifeCycle = joi.object({
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
}).unknown().required()

exports.contanierNetworkAttached = joi.object({
  id: validators.requiredString(),
  inspectData: joi.object({
    Config: joi.object({
      Labels: joi.object({
        githubOrgId: validators.requiredNumber(),
        instanceId: validators.requiredString()
      }).unknown().required()
    }).unknown().required()
  }).unknown().required()
}).unknown().required()

exports.organizationCreated = joi.object({
  organization: joi.object({
    id: validators.requiredNumber(),
    githubId: validators.requiredNumber(),
    name: validators.requiredString()
  }).required(),
  creator: joi.object({
    githubId: validators.requiredNumber(),
    githubUsername: validators.requiredString()
  }).unknown().required()
}).unknown().required()

exports.organizationIntegrationPrbotEnabled = joi.object({
  organization: exports.requiredIdNumber
}).unknown().required()

exports.workerErrored = joi.object({
  originalJobPayload: joi.object().unknown().required(),
  originalJobMeta: joi.object().unknown().required(),
  originalWorkerName: validators.requiredString(),
  error: joi.object().required()
}).unknown()

exports.dockPurged = joi.object({
  ipAddress: joi.string().ip().required(),
  githubOrgId: validators.requiredNumber()
}).unknown().required()

exports.getWorkerSchema = (workerName) => {
  const schemaName = stringcase.camelcase(workerName)
  return exports[schemaName]
}

exports.userAuthorized = exports.requiredGithubId
exports.userWhitelisted = exports.requiredGithubId

exports.firstDockCreated = exports.apiDockEvent

exports.dockRemoved = exports.dockEvent
exports.dockLost = exports.dockEvent

exports.instanceCreated = exports.instanceEvents
exports.instanceDeleted = exports.instanceEvents

exports.organizationPaymentMethodAdded = exports.orgPaymentMethodAddedRemoved
exports.organizationPaymentMethodRemoved = exports.orgPaymentMethodAddedRemoved

exports.organizationTrialEnded = exports.trialEvent
exports.organizationTrialEnding = exports.trialEvent

exports.organizationUserAdded = exports.orgUserAddedRemoved
exports.organizationUserRemoved = exports.orgUserAddedRemoved
