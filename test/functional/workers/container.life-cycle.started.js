'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const monitor = require('monitor-dog')
const Promise = require('bluebird')
const RabbitConnector = require('ponos/lib/rabbitmq')
const sinon = require('sinon')
const url = require('url')

const BuildContainerLifeCycleStartedEvent = require('../fixtures/build-container.life-cycle.started')
const InvalidContainerLifeCycleStartedEvent = require('../fixtures/invalid-container.life-cycle.started')
const logger = require('logger')
const postgresStore = require('models/persistent-stores/postgres-store')
const publisher = require('external/publisher')
const server = require('external/worker-server')
const startArithmancy = require('start')
const SubscribedEventList = require('external/subscribed-event-list')
const UserContainerLifeCycleStartedEvent = require('../fixtures/user-container.life-cycle.started')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('container.life-cycle.started functional tests', () => {
  const testPublisherName = 'test container.life-cycle.started'
  const testPublisher = new RabbitConnector({
    name: testPublisherName,
    log: logger.child({ module: 'test-publisher' }),
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
    events: SubscribedEventList
  })

  beforeEach(() => {
    sinon.spy(monitor, 'increment')
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
    monitor.increment.restore()
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

  it('should handle user container.life-cycle.started', () => {
    const testEventName = 'instance.container.started'

    testPublisher.publishEvent('container.life-cycle.started', UserContainerLifeCycleStartedEvent)

    return Promise.try(function loop () {
      return postgresStore._knex('events')
        .then((eventDataTable) => {
          if (eventDataTable.length !== 1) {
            return Promise.delay(500).then(loop)
          }
          return eventDataTable
        })
    })
    .then((eventDataTable) => {
      expect(eventDataTable).to.have.length(1)
      const eventData = eventDataTable.pop()
      const labels = UserContainerLifeCycleStartedEvent.inspectData.Config.Labels
      const testOrgId = parseInt(labels.githubOrgId, 10)
      const testUserId = parseInt(labels.sessionUserGithubId, 10)
      const testHost = url.parse(UserContainerLifeCycleStartedEvent.host).hostname
      expect(eventData).to.include({
        id: 1,
        event_name: testEventName,
        app_name: process.env.APP_NAME,
        branch_name: labels.instanceName,
        docker_host_ip: url.parse(UserContainerLifeCycleStartedEvent.host).hostname,
        github_org_id: parseInt(labels.githubOrgId, 10),
        github_user_id: parseInt(labels.sessionUserGithubId, 10)
      })

      sinon.assert.called(monitor.increment)
      sinon.assert.calledWith(monitor.increment, testEventName, {
        appName: process.env.APP_NAME,
        branchName: labels.instanceName,
        dockerHostIp: testHost,
        eventName: testEventName,
        githubOrgId: testOrgId,
        githubUserId: testUserId,
        isManualBuild: undefined,
        previousEventName: undefined
      })
    })
  })

  it('should handle build container.life-cycle.started', () => {
    const testEventName = 'container.image-builder.started'

    testPublisher.publishEvent('container.life-cycle.started', BuildContainerLifeCycleStartedEvent)

    return Promise.try(function loop () {
      return postgresStore._knex('events')
        .then((eventDataTable) => {
          if (eventDataTable.length !== 1) {
            return Promise.delay(500).then(loop)
          }
          return eventDataTable
        })
    })
    .then((eventDataTable) => {
      expect(eventDataTable).to.have.length(1)
      const eventData = eventDataTable.pop()
      const labels = BuildContainerLifeCycleStartedEvent.inspectData.Config.Labels
      const testOrgId = parseInt(labels.githubOrgId, 10)
      const testUserId = parseInt(labels.sessionUserGithubId, 10)
      const testHost = url.parse(BuildContainerLifeCycleStartedEvent.host).hostname

      expect(eventData).to.include({
        id: 1,
        event_name: testEventName,
        app_name: process.env.APP_NAME,
        docker_host_ip: url.parse(BuildContainerLifeCycleStartedEvent.host).hostname,
        github_org_id: parseInt(labels.githubOrgId, 10),
        github_user_id: parseInt(labels.sessionUserGithubId, 10)
      })

      sinon.assert.called(monitor.increment)
      sinon.assert.calledWith(monitor.increment, testEventName, {
        appName: process.env.APP_NAME,
        dockerHostIp: testHost,
        eventName: testEventName,
        githubOrgId: testOrgId,
        githubUserId: testUserId,
        isManualBuild: true,
        previousEventName: undefined,
        branchName: undefined
      })
    })
  })

  it('should handle invalid container.life-cycle.started', (done) => {
    testPublisher.publishEvent('container.life-cycle.started', InvalidContainerLifeCycleStartedEvent)

    return postgresStore._knex('events')
      .then((eventDataTable) => {
        expect(eventDataTable).to.have.length(0)

        sinon.assert.neverCalledWith(monitor.increment, 'container.life-cycle.started')
      })
  })
}) // end container.life-cycle.started functional tests
