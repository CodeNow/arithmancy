'use strict'
const Code = require('code')
const Lab = require('lab')

const postgresStore = require('models/persistent-stores/postgres-store')
const MetricEvent = require('models/data-structures/metric-event')

const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('postgres integration test', () => {
  const testDate = new Date().toISOString()
  const testData = {
    eventName: 'container.died',
    timePublished: testDate,
    timeRecevied: testDate,
    transactionId: '123123123123',
    publisherAppName: 'git.hook',
    previousEventName: 'container.start',
    org: 'djFaZe',
    stack: 'nodejs'
  }
  const testMeticEvent = new MetricEvent(testData)

  beforeEach((done) => {
    postgresStore.initialize()
      .then(() => {
        return postgresStore._knex('events').truncate()
          .then(() => {
            return postgresStore._knex('events').del()
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
    postgresStore._knex.destroy(done)
  })

  it('should write entry to database', (done) => {
    postgresStore.saveMetricEvent(testMeticEvent)
      .then(() => {
        return postgresStore._knex('events')
          .then((eventDataTable) => {
            expect(eventDataTable).to.have.length(1)
            const eventData = eventDataTable.pop()
            expect(eventData).to.equal({
              id: 1,
              event_name: 'container.died',
              time_published: testDate,
              time_recevied: testDate,
              transaction_id: '123123123123',
              publisher_app_name: 'git.hook',
              previous_event_name: 'container.start',
              org: 'djFaZe',
              stack: 'nodejs',
              host: null,
              template: null,
              branch: null
            })
          })
      })
      .asCallback(done)
  })
})
