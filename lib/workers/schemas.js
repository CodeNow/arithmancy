'use strict'
const joi = require('joi')

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
