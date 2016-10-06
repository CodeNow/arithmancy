'use strict'
require('loadenv')()
const clone = require('101/clone')
const Code = require('code')
const Lab = require('lab')

const MetricEvent = require('models/data-structures/metric-event')
const InvalidMetricEvent = require('errors/invalid-metric-event')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('metric-event', () => {
  let testData

  beforeEach((done) => {
    testData = {
      eventName: 'container.died',
      timePublished: new Date(),
      timeRecevied: new Date(),
      transactionId: '123123123123',
      appName: process.env.APP_NAME,
      previousEventName: 'container.start',
      githubOrgId: 123123,
      isWorkerSuccessfull: true
    }
    done()
  })

  describe('constructor', () => {
    it('should throw is missing data', (done) => {
      [null, undefined, [], {}].forEach((testInput) => {
        expect(() => {
          /* eslint-disable no-new */
          new MetricEvent(testInput)
          /* eslint-disable no-new */
        }).to.throw(InvalidMetricEvent)
      })

      done()
    })

    it('should saveMetricEvent all properties on event', (done) => {
      new MetricEvent(testData)
      done()
    })
  }) // end constructor

  describe('methods', () => {
    let metricEvent

    beforeEach((done) => {
      metricEvent = new MetricEvent(testData)
      done()
    })

    it('should get event data', (done) => {
      const out = metricEvent.getEventData()
      expect(out).to.equal(testData)
      done()
    })

    it('should get convert bad data', (done) => {
      const originalData = clone(testData)
      testData.githubOrgId = `${testData.githubOrgId}`
      const convertedEvent = new MetricEvent(testData)
      const out = convertedEvent.getEventData()
      expect(out).to.equal(originalData)
      done()
    })

    it('should return only tags', (done) => {
      const out = metricEvent.getTags()
      expect(out).to.equal({
        eventName: 'container.died',
        appName: process.env.APP_NAME,
        previousEventName: 'container.start',
        githubOrgId: 123123,
        isWorkerSuccessfull: true
      })
      done()
    })
  }) // end methods
})
