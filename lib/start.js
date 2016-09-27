'use strict'

const CriticalError = require('error-cat/errors/critical-error')
const ErrorCat = require('error-cat')
const log = require('./logger')
const server = require('./external/worker-server.js')
const publisher = require('./external/publisher.js')

module.exports = () => {
  return publisher.start()
    .then(() => {
      log.info('Publisher Started')
      return server.start()
    })
    .then(() => {
      log.info('Worker Started')
    })
    .catch((err) => {
      log.fatal({ err }, 'application failed to start')
      ErrorCat.report(new CriticalError(
        'Worker Server Failed to Start',
        { err }
      ))
      process.exit(1)
    })
}
