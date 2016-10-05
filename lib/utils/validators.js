'use strict'
const joi = require('joi')

module.exports = class Validators {
  static requiredNumberIfValidType (key) {
    return joi.number().when('type', { is: Validators.validType(), then: joi.required() })
  }

  static validType () {
    return joi.string().valid(['user-container', 'image-builder-container'])
  }

  static requiredString () {
    return joi.string().required()
  }

  static requiredNumber () {
    return joi.number().required()
  }

  static requiredTimestamp () {
    return joi.date().timestamp('unix').required()
  }
}
