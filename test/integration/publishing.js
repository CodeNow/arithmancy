'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const PonosServer = require('ponos').Server
const Promise = require('bluebird')

const publisher = require('external/publisher')

require('sinon-as-promised')(Promise)
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
    'container.life-cycle.started': {
      task: (job) => {
        testStub(job)
      }
    }
  }
})

describe('rabbitmq integration test', () => {
  beforeEach((done) => {
    publisher.start()
      .then(() => {
        testSubscriber.start()
      })
      .asCallback(done)
  })

  afterEach((done) => {
    publisher._publisher.disconnect()
      .then(() => {
        testSubscriber.stop()
      })
      .asCallback(done)
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

      testStub = (jobData) => {
        expect(jobData).to.equal(testJob)
        done()
      }

      publisher.publishEvent('container.life-cycle.started', testJob)
    })
  }) // end check publishing
}) // end rabbitmq integration test
