'use strict'
const joi = require('joi')
const stringcase = require('stringcase')

const validators = require('utils/validators')

const githubId = validators.requiredNumber()
const host = joi.string().uri({ scheme: 'http' }).required()
const githubOrgId = validators.requiredNumber()

exports.getWorkerSchema = (workerName) => {
  const schemaName = stringcase.camelcase(workerName)
  return exports[schemaName]
}

exports.requiredGithubId = joi.object({
  githubId
}).unknown().required()

const creator = exports.requiredGithubId
const paymentMethodOwner = exports.requiredGithubId

const owner = joi.object({
  github: validators.requiredNumber()
}).unknown().required()

const inspectData = joi.object({
  Config: joi.object({
    Labels: joi.object({
      githubOrgId: validators.requiredNumberIfValidType(),
      instanceName: joi.string()
        .when('type', { is: 'user-container', then: joi.required() }),
      manualBuild: joi.string()
        .when('type', { is: 'image-builder-container', then: joi.required() }),
      sessionUserGithubId: validators.requiredNumberIfValidType(),
      instanceId: joi.string()
        .when('type', { is: 'user-container', then: joi.required() }),
      type: validators.validType()
    }).unknown()
  }).unknown()
}).unknown()

exports.requiredGithubAndBigPoppaId = joi.object({
  id: validators.requiredNumber(),
  githubId
}).unknown().required()

exports.requiredIdNumber = joi.object({
  id: validators.requiredNumber()
}).unknown().required()

exports.dockEvent = joi.object({
  githubOrgId,
  host
}).unknown().required()

exports.organizationAndPaymentMethodOwner = joi.object({
  organization: exports.requiredIdNumber,
  paymentMethodOwner
}).unknown().required()

exports.orgPaymentMethodAddedRemoved = exports.organizationAndPaymentMethodOwner
exports.organizationInvoicePaymentFailed = exports.organizationAndPaymentMethodOwner

exports.orgUserAddedRemoved = joi.object({
  organization: exports.requiredGithubAndBigPoppaId,
  user: exports.requiredGithubAndBigPoppaId
}).unknown().required()

exports.dockInitialized = joi.object({
  githubOrgId: validators.requiredNumber(),
  instanceId: validators.requiredString()
}).unknown().required()

exports.trialEvent = joi.object({
  organization: exports.requiredIdNumber
}).unknown().required()

exports.instanceEvents = joi.object({
  instance: joi.object({
    id: validators.requiredString(),
    owner,
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
  githubId,
  dockerHostIp: joi.string().ip().required()
}).unknown().required()

exports.organizationAuthorized = joi.object({
  githubId,
  creator
}).unknown().required()

exports.containerLifeCycle = joi.object({
  id: validators.requiredString(),
  host,
  inspectData
}).unknown().required()

exports.applicationContainerCreated =
exports.applicationContainerDied =
exports.applicationContainerStarted =

exports.buildContainerCreated =
exports.buildContainerDied =
exports.buildContainerStarted =

exports.containerLifeCycleCreated =
exports.containerLifeCycleDied =
exports.containerLifeCycleStarted = exports.containerLifeCycle

exports.organizationCreated = joi.object({
  organization: exports.requiredGithubAndBigPoppaId,
  creator
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
  githubOrgId
}).unknown().required()

exports.dockDiskFilled =
exports.dockLost =
exports.dockMemoryExhausted =
exports.dockRemoved =
exports.dockUnresponsive = exports.dockEvent

exports.containerNetworkAttached = exports.containerLifeCycle

exports.firstDockCreated = exports.apiDockEvent

exports.githubPushed = joi.object({
  deliveryId: joi.string().required(),
  payload: joi.object({
    repository: joi.object({
      full_name: joi.string().required(),
      owner: joi.object({
        id: joi.number()
      }).unknown().required()
    }).unknown().required(),
    organization: joi.object({
      id: joi.number()
    }).unknown(),
    sender: joi.object({
      id: githubId
    }).unknown().required(),
    ref: joi.string().required()
  }).unknown().required()
}).unknown().required()

exports.instanceCreated =
exports.instanceDeleted =
exports.instanceUpdated =
exports.instanceStarted = exports.instanceEvents

exports.instanceDeployed = joi.object({
  instanceId: joi.string().required(),
  cvId: joi.string().required()
}).unknown().required()

exports.organizationPaymentMethodAdded =
exports.organizationPaymentMethodRemoved = exports.orgPaymentMethodAddedRemoved

exports.organizationTrialEnded =
exports.organizationTrialEnding = exports.trialEvent

exports.organizationUserAdded =
exports.organizationUserRemoved = exports.orgUserAddedRemoved

exports.userAuthorized = exports.requiredGithubId

exports.stripeInvoiceCreated =
exports.stripeInvoicePaymentFailed =
exports.stripeInvoicePaymentSucceeded = joi.object({
  stripeEventId: joi.string().required(),
  stripeCustomerId: joi.string()
}).unknown().required()

exports.autoIsolationConfigCreated = joi.object({
  autoIsolationConfig: joi.object({
    id: joi.string().required()
  }).unknown().required(),
  user: joi.object({
    id: joi.number().required()
  }).unknown().required(),
  organization: joi.object({
    id: joi.number().required()
  }).unknown().required()
}).unknown().required()

exports.applicationUrlVisited = joi.object({
  elasticUrl: joi.string().required(),
  ownerGithubId: joi.number().required(),
  ownerUsername: joi.string().required(),
  referer: joi.string(),
  refererIsGithub: joi.boolean().required(),
  shortHash: joi.string().required(),
  targetHost: joi.string().required()
}).unknown().required()
