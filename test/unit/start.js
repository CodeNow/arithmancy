'use strict'
const ErrorCat = require('error-cat')
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const datadogForwarder = require('models/forwarders/datadog-forwarder')
const postgresStore = require('models/persistent-stores/postgres-store')
const publisher = require('external/publisher')
const start = require('start')
const workerServer = require('external/worker-server')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('start.js unit test', () => {
  describe('flow', () => {
    beforeEach((done) => {
      sinon.stub(publisher, 'start')
      sinon.stub(datadogForwarder, 'initialize')
      sinon.stub(postgresStore, 'initialize')
      sinon.stub(workerServer, 'start')
      sinon.stub(ErrorCat, 'report')
      sinon.stub(process, 'exit')
      done()
    })

    afterEach((done) => {
      datadogForwarder.initialize.restore()
      postgresStore.initialize.restore()
      publisher.start.restore()
      workerServer.start.restore()
      ErrorCat.report.restore()
      process.exit.restore()
      done()
    })

    it('should start publisher and server', (done) => {
      publisher.start.resolves()
      workerServer.start.resolves()
      datadogForwarder.initialize.resolves()
      postgresStore.initialize.resolves()

      start().asCallback((err) => {
        if (err) { return done(err) }
        sinon.assert.callOrder(
          datadogForwarder.initialize,
          postgresStore.initialize,
          publisher.start,
          workerServer.start
        )
        sinon.assert.notCalled(process.exit)
        sinon.assert.notCalled(ErrorCat.report)
        done()
      })
    })

    it('should report and exit on error', (done) => {
      datadogForwarder.initialize.rejects(new Error('death star'))

      start().asCallback((err) => {
        if (err) { return done(err) }
        sinon.assert.callOrder(
          ErrorCat.report,
          process.exit
        )

        done()
      })
    })
  }) // end flow
}) // end start.js unit test
