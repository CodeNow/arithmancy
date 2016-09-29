'use strict'
const Code = require('code')
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const DatabaseError = require('errors/database-error')
const NotNullError = require('errors/not-null-error')
const postgresStore = require('models/persistent-stores/postgres-store')
const UniqueError = require('errors/unique-error')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('persistent-store unit test', () => {
  describe('methods', () => {
    beforeEach((done) => {
      delete postgresStore._knex
      done()
    })

    describe('initialize', () => {
      it('should create _knex', (done) => {
        process.env.POSTGRES_CONNECT_STRING = null

        postgresStore.initialize()
        expect(postgresStore._knex).to.exist()

        done()
      })
    }) // end initialize

    describe('saveMetricEvent', () => {
      const testData = {
        Avada: 'Kedavra'
      }
      const testMetricEvent = {
        getDataInSnakeCase: () => { return testData }
      }
      let insertStub
      beforeEach((done) => {
        insertStub = sinon.stub()
        postgresStore._knex = sinon.stub().returns({
          insert: insertStub
        })

        done()
      })

      it('should insert into db', () => {
        insertStub.resolves()
        return postgresStore.saveMetricEvent(testMetricEvent)
          .then(() => {
            sinon.assert.calledOnce(postgresStore._knex)
            sinon.assert.calledWith(postgresStore._knex, 'events')

            sinon.assert.calledOnce(insertStub)
            sinon.assert.calledWith(insertStub, testData)
          })
      })

      it('should cast NotNullError error', () => {
        const testNotNullError = new Error('NotNullError')
        testNotNullError.code = '23502'
        insertStub.rejects(testNotNullError)

        return postgresStore.saveMetricEvent(testMetricEvent)
          .catch((err) => {
            expect(err).to.be.instanceOf(NotNullError)
          })
      })

      it('should cast UniqueError error', () => {
        const testUniqueError = new Error('UniqueError')
        testUniqueError.code = '23505'
        insertStub.rejects(testUniqueError)

        return postgresStore.saveMetricEvent(testMetricEvent)
          .catch((err) => {
            expect(err).to.be.instanceOf(UniqueError)
          })
      })

      it('should cast DatabaseError error', () => {
        const testDatabaseError = new Error('DatabaseError')
        insertStub.rejects(testDatabaseError)

        return postgresStore.saveMetricEvent(testMetricEvent)
          .catch((err) => {
            expect(err).to.be.instanceOf(DatabaseError)
          })
      })
    }) // end saveMetricEvent
  }) // end methods
}) // persistent-store unit test
