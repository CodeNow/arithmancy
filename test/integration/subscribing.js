'use strict'
require('loadenv')()
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')
const RabbitConnector = require('ponos/lib/rabbitmq')

const ContainerLifeCycle = require('workers/container.life-cycle')
const SubscribedEventList = require('external/subscribed-event-list')
const workerServer = require('external/worker-server')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const afterEach = lab.afterEach
const beforeEach = lab.beforeEach

const testPublisher = new RabbitConnector({
  name: process.env.APP_NAME,
  hostname: process.env.RABBITMQ_HOSTNAME,
  port: process.env.RABBITMQ_PORT,
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
  events: SubscribedEventList
})

describe('rabbitmq integration test', () => {
  describe('check subscribing', () => {
    beforeEach(() => {
      sinon.stub(ContainerLifeCycle._Worker.prototype, 'task')
      sinon.spy(ContainerLifeCycle, 'task')
      return testPublisher.connect()
        .then(() => {
          return workerServer.start()
        })
    })

    afterEach(() => {
      ContainerLifeCycle._Worker.prototype.task.restore()
      ContainerLifeCycle.task.restore()
      return testPublisher.disconnect()
        .then(() => {
          return workerServer.stop()
        })
    })

    it('should call worker', (done) => {
      ContainerLifeCycle._Worker.prototype.task.resolves()
      const testJob = {
        host: 'http://10.0.0.1:4242',
        inspectData: {
          Config: {
            Labels: {
              githubOrgId: 987654,
              instanceName: 'instanceName',
              manualBuild: 'true',
              sessionUserGithubId: 123345,
              type: 'user-container'
            }
          }
        }
      }
      testPublisher.publishEvent('container.life-cycle.started', testJob)
      return Promise.try(function loop () {
        if (ContainerLifeCycle.task.callCount === 0) {
          return Promise.delay(500)
        }
      })
      .then(() => {
        sinon.assert.calledOnce(ContainerLifeCycle._Worker.prototype.task)
        sinon.assert.calledWithExactly(ContainerLifeCycle._Worker.prototype.task)
        sinon.assert.calledOnce(ContainerLifeCycle.task)
        sinon.assert.calledWith(ContainerLifeCycle.task, testJob)
      })
    })
  }) // end check subscribing
}) // end rabbitmq integration test
