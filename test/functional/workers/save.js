'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const monitor = require('monitor-dog')
const Promise = require('bluebird')
const RabbitConnector = require('ponos/lib/rabbitmq')
const sinon = require('sinon')
const url = require('url')

const logger = require('logger')
const postgresStore = require('models/persistent-stores/postgres-store')
const publisher = require('external/publisher')
const server = require('external/worker-server')
const startArithmancy = require('start')
const UserContainerLifeCycleStartedEvent = require('../fixtures/user-container.life-cycle.started')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('container.life-cycle.started functional tests', () => {
  const testEventName = 'instance.container.started'
  const testPublisherName = 'test container.life-cycle.started'
  const testPublisher = new RabbitConnector({
    name: testPublisherName,
    log: logger.child({ module: 'test-publisher' }),
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
    events: ['container.life-cycle.started']
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
      expect(eventData.id).to.equal(1)
      expect(eventData.event_name).to.equal(testEventName)
      expect(eventData.app_name).to.equal(testPublisherName)
      expect(eventData.branch_name).to.equal(labels.instanceName)
      expect(eventData.docker_host_ip).to.equal(testHost)
      expect(eventData.github_org_id).to.equal(testOrgId)
      expect(eventData.github_user_id).to.equal(testUserId)
      expect(eventData).to.include({
        id: 1,
        event_name: testEventName,
        app_name: testPublisherName,
        branch_name: labels.instanceName,
        docker_host_ip: url.parse(UserContainerLifeCycleStartedEvent.host).hostname,
        github_org_id: parseInt(labels.githubOrgId, 10),
        github_user_id: parseInt(labels.sessionUserGithubId, 10)
      })

      sinon.assert.called(monitor.increment)
      sinon.assert.calledWith(monitor.increment, testEventName, {
        appName: testPublisherName,
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

  it.skip('should handle build container.life-cycle.started', (done) => {
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
      expect(eventData.id).to.equal(1)
      expect(eventData.event_name).to.equal(testEventName)
      expect(eventData.app_name).to.equal(testPublisherName)
      expect(eventData.branch_name).to.equal(labels.instanceName)
      expect(eventData.docker_host_ip).to.equal(testHost)
      expect(eventData.github_org_id).to.equal(testOrgId)
      expect(eventData.github_user_id).to.equal(testUserId)
      expect(eventData).to.include({
        id: 1,
        event_name: testEventName,
        app_name: testPublisherName,
        branch_name: labels.instanceName,
        docker_host_ip: url.parse(UserContainerLifeCycleStartedEvent.host).hostname,
        github_org_id: parseInt(labels.githubOrgId, 10),
        github_user_id: parseInt(labels.sessionUserGithubId, 10)
      })

      sinon.assert.called(monitor.increment)
      sinon.assert.calledWith(monitor.increment, testEventName, {
        appName: testPublisherName,
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

  it.skip('should handle invalid container.life-cycle.started', (done) => {
    testPublisher.publishEvent('container.life-cycle.started', {})
    done()
  })
}) // end container.life-cycle.started functional tests
