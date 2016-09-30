'use strict'
require('loadenv')()
const Lab = require('lab')
const PonosServer = require('ponos').Server
const Promise = require('bluebird')
const sinon = require('sinon')

const publisher = require('external/publisher')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const afterEach = lab.afterEach
const beforeEach = lab.beforeEach

let testStub

const testSubscriber = new PonosServer({
  name: process.env.APP_NAME,
  rabbitmq: {
    channel: {
      prefetch: process.env.WORKER_PREFETCH
    },
    hostname: process.env.RABBITMQ_HOSTNAME,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD
  },
  events: {
    'container.life-cycle.started': {
      task: (job) => {
        testStub(job)
      }
    }
  }
})

describe('rabbitmq integration test', () => {
  beforeEach(() => {
    testStub = sinon.stub()
    return publisher.start()
      .then(() => {
        return testSubscriber.start()
      })
  })

  afterEach(() => {
    return publisher._publisher.disconnect()
      .then(() => {
        return testSubscriber.stop()
      })
  })

  describe('check publishing', () => {
    it('should publish test job', (done) => {
      const testJob = {
        host: 'http://10.0.0.1:4242',
        inspectData: {
          Config: {
            Labels: {
              githubOrgId: 987654,
              instanceName: 'instanceName',
              manualBuild: 'manualBuild',
              sessionUserGithubId: 123345,
              type: 'type'
            }
          }
        }
      }

      publisher.publishEvent('container.life-cycle.started', testJob)

      return Promise.try(function loop () {
        if (testStub.callCount !== 1) {
          return Promise.delay(500)
        }
      })
      .then(() => {
        sinon.assert.calledOnce(testStub)
        sinon.assert.calledWith(testStub, testJob)
      })
    })
  }) // end check publishing
}) // end rabbitmq integration test
