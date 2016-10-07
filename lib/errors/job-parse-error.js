'use strict'
const WorkerStopError = require('error-cat/errors/worker-stop-error')

module.exports = class JobParseError extends WorkerStopError {
  /**
   * @param {Error}  error
   * @param {Object}  data
   */
  constructor (error) {
    super('Error parsing job: ' + error.message, error)
  }
}
