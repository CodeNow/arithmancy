'use strict'
const Lab = require('lab')
const Code = require('code')

const MetricEvent = require('../../../lib/models/metric-event')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('metric-event', () => {
  const testData = {
    eventName: 'container.died',
    timePublished: new Date().toISOString(),
    timeRecevied: new Date().toISOString(),
    transactionId: '123123123123',
    originatingEventName: 'git.hook',
    previousEventName: 'container.start',
    tags: {
      org: 'anandkumarpatel',
      stack: 'anandkumarpatel'
    }
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

    it('should save all properties on event', (done) => {
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
