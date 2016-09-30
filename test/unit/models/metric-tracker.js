'use strict'
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const MetricEvent = require('models/data-structures/metric-event')
const datadogForwarder = require('models/forwarders/datadog-forwarder')
const MetricTracker = require('models/metric-tracker')
const postgresStore = require('models/persistent-stores/postgres-store')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('metric-tracker unit test', () => {
  const testDate = new Date()
  const testData = {
    appName: process.env.APP_NAME,
    eventName: 'container.died',
    timePublished: testDate,
    timeRecevied: testDate,
    transactionId: '123123123123',
    previousEventName: 'container.start',
    githubOrgId: 123123
  }

  describe('methods', () => {
    beforeEach((done) => {
      sinon.stub(datadogForwarder, 'sendMetricEvent')
      sinon.stub(postgresStore, 'saveMetricEvent')
      done()
    })

    afterEach((done) => {
      datadogForwarder.sendMetricEvent.restore()
      postgresStore.saveMetricEvent.restore()
      done()
    })

    it('should forward and save data', () => {
      const testMetricEvent = new MetricEvent(testData)

      return MetricTracker.track(testData)
        .then(() => {
          sinon.assert.calledOnce(datadogForwarder.sendMetricEvent)
          sinon.assert.calledWith(datadogForwarder.sendMetricEvent, testMetricEvent)

          sinon.assert.calledOnce(postgresStore.saveMetricEvent)
          sinon.assert.calledWith(postgresStore.saveMetricEvent, testMetricEvent)
        })
    })
  }) // end methods
})
