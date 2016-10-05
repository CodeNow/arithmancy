'use strict'
const joi = require('joi')

module.exports = class Validators {
  static requiredNumberIfValidType (key) {
    return joi.number().when('type', { is: Validators.validType(), then: joi.required() })
  }

  static validType () {
    return joi.string().valid(['user-container', 'image-builder-container'])
  }
}
