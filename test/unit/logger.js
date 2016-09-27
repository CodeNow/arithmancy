'use strict'
require('loadenv')()
const cls = require('continuation-local-storage').createNamespace('ponos')
const Code = require('code')
const Lab = require('lab')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const expect = Code.expect
const it = lab.it

const logger = require('../../lib/logger.js')

describe('logger.js unit test', () => {
  describe('loading', () => {
    it('should add props to logger', (done) => {
      const log = logger.child({ test: 'prop' })
      expect(log.fields.test).to.equal('prop')
      done()
    })
  }) // end loading

  describe('serializers', () => {
    const serializers = logger.serializers
    it('should use ponos namespace', (done) => {
      const testId = 'blue is good'
      cls.run(() => {
        cls.set('tid', testId)
        const out = serializers.tx()
        expect(out.tid).to.equal(testId)
        done()
      })
    })

    it('should not error if no namespace', (done) => {
      const out = serializers.tx()
      expect(out).to.be.undefined()
      done()
    })
  }) // end serializers
})
