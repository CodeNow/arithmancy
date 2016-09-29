'use strict'
const BaseError = require('error-cat/errors/base-error')

module.exports = class NotImplemented extends BaseError {
  constructor () {
    super('Not Implemented')
  }
}
