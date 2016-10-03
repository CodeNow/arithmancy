'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const Promise = require('bluebird')
const RabbitConnector = require('ponos/lib/rabbitmq')

const startArithmancy = require('start')
const datadogForwarder = require('models/forwarders/datadog-forwarder')
const logger = require('logger')
const MetricEvent = require('models/data-structures/metric-event')
const postgresStore = require('models/persistent-stores/postgres-store')
const server = require('external/worker-server')
const publisher = require('external/publisher')
const UserContainerLifeCycleStartedEvent = require('../fixtures/user-container.life-cycle.started')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('container.life-cycle.started functional tests', () => {
  const testPublisher = new RabbitConnector({
    name: 'test container.life-cycle.started',
    log: logger.child({ module: 'test-publisher' }),
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
    events: ['container.life-cycle.started']
  })

  beforeEach(() => {
    return testPublisher.connect()
      .then(() => {
        return postgresStore.initialize()
      })
      .then(() => {
        return postgresStore._knex('events').truncate()
      })
      .then(() => {
        return postgresStore._knex('events').del()
      })
      .catch((err) => {
        if (!~err.message.indexOf('does not exist')) {
          throw err
        }
      })
      .then(() => {
        return startArithmancy()
      })
  })

  afterEach(() => {
    return postgresStore._knex.destroy()
      .then(() => {
        return publisher._publisher.disconnect()
      })
      .then(() => {
        return server.stop()
      })
      .then(() => {
        return testPublisher.disconnect()
      })
  })

  it('should handle user container.life-cycle.started', (done) => {
    testPublisher.publishEvent('container.life-cycle.started', UserContainerLifeCycleStartedEvent)
    done()
  })

  it.skip('should handle build container.life-cycle.started', (done) => {
    testPublisher.publishEvent('container.life-cycle.started', {})
    done()
  })

  it.skip('should handle invalid container.life-cycle.started', (done) => {
    testPublisher.publishEvent('container.life-cycle.started', {})
    done()
  })
}) // end container.life-cycle.started functional tests
