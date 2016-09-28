'use strict'
const Code = require('code')
const Lab = require('lab')

const postgresStore = require('models/persistent-stores/postgres-store')
const MetricEvent = require('models/data-structures/metric-event')

const lab = exports.lab = Lab.script()

const after = lab.after
const afterEach = lab.afterEach
const before = lab.before
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('postgres integration test', () => {
  const testData = {
    eventName: 'container.died',
    timePublished: new Date().toISOString(),
    timeRecevied: new Date().toISOString(),
    transactionId: '123123123123',
    publisherAppName: 'git.hook',
    publisherEventName: 'container.start',
    tags: {
      org: 'anandkumarpatel',
      stack: 'anandkumarpatel'
    }
  }

  beforeEach((done) => {
    postgresStore.initialize()
      .then(() => {
        return postgresStore._bookshelf.knex('events').truncate()
          .then(() => {
            return postgresStore._bookshelf.knex('events').del()
          })
          .catch((err) => {
            if (!~err.message.indexOf('does not exist')) {
              throw err
            }
          })
      })
      .asCallback(done)
  })

  afterEach((done) => {
    postgresStore._bookshelf.knex.destroy(done)
  })

  it('should write entry to database', (done) => {
    postgresStore.saveMetricEvent(new MetricEvent(testData))
      .asCallback(done)
  })
})
