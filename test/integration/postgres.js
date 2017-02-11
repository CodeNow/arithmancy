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
            expect(eventData.app_name).to.equal(process.env.APP_NAME)
            expect(eventData.big_poppa_org_id).to.equal(null)
            expect(eventData.big_poppa_user_id).to.equal(null)
            expect(eventData.branch_name).to.equal(null)
            expect(eventData.container_id).to.equal(null)
            expect(eventData.container_type).to.equal('user-container')
            expect(eventData.context_version_id).to.equal(null)
            expect(eventData.docker_host_ip).to.equal(null)
            expect(eventData.elastic_url).to.equal(null)
            expect(eventData.event_name).to.equal('container.died')
            expect(eventData.github_org_id).to.equal(123123)
            expect(eventData.github_org_username).to.equal(null)
            expect(eventData.github_user_id).to.equal(null)
            expect(eventData.id).to.equal(1)
            expect(eventData.instance_id).to.equal(null)
            expect(eventData.is_manual_build).to.equal(null)
            expect(eventData.is_worker_successfull).to.equal(true)
            expect(eventData.master_instance_id).to.equal(null)
            expect(eventData.navi_target_host).to.equal(null)
            expect(eventData.previous_event_name).to.equal('container.start')
            expect(eventData.referer).to.equal(null)
            expect(eventData.repo_name).to.equal(null)
            expect(eventData.short_hash).to.equal(null)
            expect(eventData.stripe_customer_id).to.equal(null)
            expect(eventData.time_published).to.equal(testDate)
            expect(eventData.time_recevied).to.equal(testDate)
            expect(eventData.transaction_id).to.equal('123123123123')
          })
      })
  })
})

