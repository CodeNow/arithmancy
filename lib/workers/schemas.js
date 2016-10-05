'use strict'
const joi = require('joi')

exports.dockEvent = joi.object({
  githubOrgId: joi.number().required()
}).unknown().required()

exports.orgPaymentMethodAddedRemoved = exports.orgPaymentFailed = joi.object({
  organization: joi.object({
    id: joi.number().required()
  }).unknown().required(),
  paymentMethodOwner: joi.object({
    githubId: joi.number().required()
  }).unknown().required()
}).unknown().required()

exports.orgUserAddedRemoved = joi.object({
  organization: joi.object({
    id: joi.number().required(),
    githubId: joi.number().required()
  }).required(),
  user: joi.object({
    id: joi.number().required(),
    githubId: joi.number().required()
  }).required()
}).unknown().required()

exports.trialEvent = joi.object({
  organization: joi.object({
    id: joi.number().required()
  }).required()
}).unknown().required()

exports.instanceEvents = joi.object({
  instance: joi.object({
    id: joi.string().required(),
    owner: joi.object({
      github: joi.number().required()
    }).unknown().required(),
    contextVersion: joi.object({
      appCodeVersions: joi.array().items(
        joi.object({
          repo: joi.string().required(),
          branch: joi.string().required()
        }).unknown()
      ).required()
    }).unknown().required()
  }).unknown().required()
}).unknown().required()
