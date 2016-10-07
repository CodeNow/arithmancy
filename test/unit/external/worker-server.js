'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const Promise = require('bluebird')

const workerServer = require('external/worker-server')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('worker-server unit test', () => {
  describe('module properties', () => {
    it('should expose start', (done) => {
      expect(workerServer.start).to.be.a.function()
      done()
    })

    it('should have populated events', (done) => {
      expect(workerServer._events).to.be.an.object()
      done()
    })
  }) // end module properties
}) // end worker-server unit test
