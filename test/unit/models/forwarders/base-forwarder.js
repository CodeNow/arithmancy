'use strict'
const Code = require('code')
const Lab = require('lab')

const NotImplemented = require('errors/not-implemented')
const BaseForwarder = require('models/forwarders/base-forwarder')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('base-forworder unit test', () => {
  describe('methods', () => {
    let forwarder

    beforeEach((done) => {
      forwarder = new BaseForwarder()
      done()
    })

    describe('connect', () => {
      it('should throw it not implemented', (done) => {
        expect(() => {
          forwarder.initialize()
        }).to.throw(NotImplemented, /Not Implemented/)

        done()
      })
    }) // end connect

    describe('sendMetricEvent', () => {
      it('should throw if not implemented', (done) => {
        expect(() => {
          forwarder.sendMetricEvent()
        }).to.throw(NotImplemented, /Not Implemented/)

        done()
      })
    }) // end sendMetricEvent
  }) // end methods
}) // base-forworder unit test
