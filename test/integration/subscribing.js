'use strict'
require('loadenv')()
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')
const RabbitConnector = require('ponos/lib/rabbitmq')

const baseMetricWorker = require('workers/base.metric.worker')
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
      sinon.stub(baseMetricWorker.prototype, 'task')
      return testPublisher.connect()
        .then(() => {
          return workerServer.start()
        })
    })

    afterEach(() => {
      baseMetricWorker.prototype.task.restore()
      return testPublisher.disconnect()
        .then(() => {
          return workerServer.stop()
        })
    })

    it('should call worker', (done) => {
      baseMetricWorker.prototype.task.resolves()
      const testJob = {
        id: 'e0a640ed40f4e80c3976bd272d428b7ca0282d827937cf4a2a7471c1afd70741',
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
        if (baseMetricWorker.prototype.task.callCount === 0) {
          return Promise.delay(100)
        }
      })
      .then(() => {
        sinon.assert.calledOnce(baseMetricWorker.prototype.task)
        sinon.assert.calledWithExactly(baseMetricWorker.prototype.task)
      })
    })
  }) // end check subscribing
}) // end rabbitmq integration test
