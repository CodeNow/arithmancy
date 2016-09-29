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
      .then(() => {
        return postgresStore._eventsModel.fetchAll({require: true})
          .tap((eventDataCollection) => {
            return eventDataCollection.count().then((number) => {
              expect(number).to.equal('1')
            })
          })
          .tap((eventDataCollection) => {
            const eventData = eventDataCollection.pop()
            expect(eventData.attributes).to.equal({
              eventName: 'container.died',
              timePublished: testDate,
              timeRecevied: testDate,
              transactionId: '123123123123',
              publisherAppName: 'git.hook',
              publisherEventName: 'container.start',
              org: 'anandkumarpatel',
              stack: 'anandkumarpatel'
            })
          })
      })
      .asCallback(done)
  })
})
