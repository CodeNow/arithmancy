'use strict'
require('loadenv')()

const Code = require('code')
const Lab = require('lab')
const PonosServer = require('ponos').Server

const publisher = require('external/publisher')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const expect = Code.expect

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
    'task.created': {
      task: (job) => {
        testStub(job)
      }
    }
  }
})

// TODO fix when we have workers
describe.skip('rabbitmq integration test', () => {
  beforeEach((done) => {
    publisher.start()
      .then(() => {
        testSubscriber.start()
      })
      .asCallback(done)
  })

  afterEach((done) => {
    publisher._publisher.disconnect()
      // .delay(1000)
      .then(() => {
        testSubscriber.stop()
      })
      .asCallback(done)
  })

  describe('check publishing', () => {
    it('should publish test job', (done) => {
      const testId = '1234'
      const testJob = {
        id: testId
      }

      testStub = (jobData) => {
        expect(jobData.id).to.equal(testId)
        done()
      }

      publisher.publishEvent('task.created', testJob)
    })
  }) // end publishContainerNetworkAttached
}) // end rabbitmq integration test
