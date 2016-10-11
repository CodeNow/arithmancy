'use strict'
const joi = require('joi')
const stringcase = require('stringcase')

const validators = require('utils/validators')

const githubId = validators.requiredNumber()
const host = joi.string().uri({ scheme: 'http' }).required()
const githubOrgId = validators.requiredNumber()

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
      githubOrgId: validators.requiredNumberIfValidType()
        .when('type', { is: validators.validType(), then: joi.required() }),
      instanceName: joi.string()
        .when('type', { is: 'user-container', then: joi.required() }),
      manualBuild: joi.string()
        .when('type', { is: 'image-builder-container', then: joi.required() }),
      sessionUserGithubId: validators.requiredNumberIfValidType(),
      instanceId: validators.requiredString()
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

exports.getWorkerSchema = (workerName) => {
  const schemaName = stringcase.camelcase(workerName)
  return exports[schemaName]
}

exports.userAuthorized = exports.requiredGithubId
exports.userWhitelisted = exports.requiredGithubId

exports.firstDockCreated = exports.apiDockEvent

exports.dockRemoved =
exports.dockLost = exports.dockEvent

exports.instanceCreated =
exports.instanceDeleted =
exports.instanceUpdated = exports.instanceEvents

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

exports.contanierNetworkAttached = exports.containerLifeCycle
