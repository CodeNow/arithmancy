'use strict'
const WorkerStopError = require('error-cat/errors/worker-stop-error')

/**
 * Base class for all invalid metric errors
 */
module.exports = class InvalidMetricEvent extends WorkerStopError {
  /**
   * @param {Error}  joiError
   * @param {Object}  originalEvent
   */
  constructor (joiError, originalEvent) {
    super('invalid metric event: ' + joiError.message, {
      joiError: joiError,
      originalData: originalEvent
    })
  }
}
