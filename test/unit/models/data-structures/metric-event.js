'use strict'
const Lab = require('lab')
const Code = require('code')

const MetricEvent = require('models/data-structures/metric-event')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('metric-event', () => {
  const testData = {
    eventName: 'container.died',
    timePublished: new Date(),
    timeRecevied: new Date(),
    transactionId: '123123123123',
    appName: process.env.APP_NAME,
    previousEventName: 'container.start',
    githubOrgId: 123123
  }

  describe('constructor', () => {
    it('should throw is missing data', (done) => {
      [null, undefined, [], {}].forEach((testInput) => {
        expect(() => {
          /* eslint-disable no-new */
          new MetricEvent(testInput)
          /* eslint-disable no-new */
        }).to.throw(Error, /Invalid MetricEvent/)
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
  }) // end methods
})
