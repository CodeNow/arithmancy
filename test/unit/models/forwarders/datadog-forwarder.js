'use strict'
const Code = require('code')
const Lab = require('lab')
const sinon = require('sinon')

const datadogForwarder = require('models/forwarders/datadog-forwarder')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('datadog-forworder unit test', () => {
  describe('methods', () => {
    beforeEach((done) => {
      datadogForwarder._datadogClient = undefined
      done()
    })

    describe('initialize', () => {
      it('should throw it not implemented', (done) => {
        datadogForwarder.initialize()
          .then(() => {
            expect(datadogForwarder._datadogClient).to.exist()
            done()
          })
      })
    }) // end initialize

    describe('sendMetricEvent', () => {
      const testName = 'Aparecium'
      const testTags = {
        spell: 'bound',
        dark: 'arts'
      }
      const testMetricEvent = {
        getEventData: () => {
          return {
            name: testName,
            tags: testTags
          }
        }
      }

      beforeEach((done) => {
        datadogForwarder._datadogClient = {
          increment: sinon.stub()
        }
        done()
      })

      it('should throw if not implemented', (done) => {
        datadogForwarder.sendMetricEvent(testMetricEvent)
          .then(() => {
            sinon.assert.calledOnce(datadogForwarder._datadogClient.increment)
            sinon.assert.calledWith(datadogForwarder._datadogClient.increment, testName, testTags)
            done()
          })
      })
    }) // end sendMetricEvent
  }) // end methods
}) // datadog-forworder unit test
