'use strict'
const WorkerStopError = require('error-cat/errors/worker-stop-error')

/**
 * Base class for all invalid metric errors
 */
module.exports = class InvalidMetricEvent extends WorkerStopError {
  /**
   * @param {Error}  error
   * @param {Object}  data
   */
  constructor (error) {
    super('invalid data passed to metric event: ' + error.message, error)
  }
}
