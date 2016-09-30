'use strict'
const CriticalError = require('error-cat/errors/critical-error')
const ErrorCat = require('error-cat')

const datadogForwarder = require('models/forwarders/datadog-forwarder')
const log = require('logger')
const postgresStore = require('models/persistent-stores/postgres-store')
const publisher = require('external/publisher.js')
const server = require('external/worker-server.js')

module.exports = () => {
  return datadogForwarder.initialize()
    .then(() => {
      log.info('Datadog Initialized')
      return postgresStore.initialize()
    })
    .then(() => {
      log.info('Postgres Initialized')
      return publisher.start()
    })
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
