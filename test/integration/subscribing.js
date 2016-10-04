'use strict'
require('loadenv')()
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')
const RabbitConnector = require('ponos/lib/rabbitmq')

const ContainerLifeCycleStarted = require('workers/container.life-cycle.started')
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
  events: [
    'container.life-cycle.started',
    'container.network.attached',
    'organization.created',
    'worker.errored'
  ]
})

describe('rabbitmq integration test', () => {
  describe('check subscribing', () => {
    beforeEach(() => {
      sinon.stub(ContainerLifeCycleStarted._Worker.prototype, 'task')
      sinon.spy(ContainerLifeCycleStarted, 'task')
      return testPublisher.connect()
        .then(() => {
          return workerServer.start()
        })
    })

    afterEach(() => {
      ContainerLifeCycleStarted._Worker.prototype.task.restore()
      ContainerLifeCycleStarted.task.restore()
      return testPublisher.disconnect()
        .then(() => {
          return workerServer.stop()
        })
    })

    it('should call worker', (done) => {
      ContainerLifeCycleStarted._Worker.prototype.task.resolves()
      const testJob = {
        host: 'http://10.0.0.1:4242',
        inspectData: {
          Config: {
            Labels: {
              githubOrgId: 987654,
              instanceName: 'instanceName',
              manualBuild: true,
              sessionUserGithubId: 123345,
              type: 'type'
            }
          }
        }
      }
      testPublisher.publishEvent('container.life-cycle.started', testJob)
      return Promise.try(function loop () {
        if (ContainerLifeCycleStarted.task.callCount === 0) {
          return Promise.delay(500)
        }
      })
      .then(() => {
        sinon.assert.calledOnce(ContainerLifeCycleStarted._Worker.prototype.task)
        sinon.assert.calledWithExactly(ContainerLifeCycleStarted._Worker.prototype.task)
        sinon.assert.calledOnce(ContainerLifeCycleStarted.task)
        sinon.assert.calledWith(ContainerLifeCycleStarted.task, testJob)
      })
    })
  }) // end check subscribing
}) // end rabbitmq integration test
