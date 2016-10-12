'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const Promise = require('bluebird')

const postgresStore = require('models/persistent-stores/postgres-store')
const MetricEvent = require('models/data-structures/metric-event')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('postgres integration test', () => {
  const testDate = new Date()
  const testData = {
    appName: process.env.APP_NAME,
    eventName: 'container.died',
    timePublished: testDate,
    timeRecevied: testDate,
    transactionId: '123123123123',
    previousEventName: 'container.start',
    containerType: 'user-container',
    githubOrgId: 123123
  }
  const testMeticEvent = new MetricEvent(testData)

  beforeEach(() => {
    return postgresStore.initialize()
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
  })

  afterEach(() => {
    return postgresStore._knex.destroy()
  })

  it('should write entry to database', () => {
    return postgresStore.saveMetricEvent(testMeticEvent)
      .then(() => {
        return postgresStore._knex('events')
          .then((eventDataTable) => {
            expect(eventDataTable).to.have.length(1)
            const eventData = eventDataTable.pop()
            expect(eventData).to.equal({
              id: 1,
              event_name: 'container.died',
              app_name: process.env.APP_NAME,
              time_published: testDate,
              time_recevied: testDate,
              transaction_id: '123123123123',
              previous_event_name: 'container.start',
              github_org_id: 123123,
              container_type: 'user-container',
              stripe_customer_id: null,
              github_user_id: null,
              big_poppa_org_id: null,
              big_poppa_user_id: null,
              docker_host_ip: null,
              master_instance_id: null,
              instance_id: null,
              context_version_id: null,
              container_id: null,
              is_manual_build: null,
              is_worker_successfull: true,
              repo_name: null,
              branch_name: null
            })
          })
      })
  })
})
