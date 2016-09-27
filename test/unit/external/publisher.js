'use strict'
require('loadenv')()
const Code = require('code')
const Lab = require('lab')
const RabbitConnector = require('ponos/lib/rabbitmq')
const sinon = require('sinon')
const Promise = require('bluebird')

const publishedEventList = require('../../../lib/external/published-event-list.js')
const publisher = require('../../../lib/external/publisher.js')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('publisher.js unit test', () => {
  describe('start', () => {
    beforeEach((done) => {
      sinon.stub(RabbitConnector.prototype, 'connect')
      done()
    })

    afterEach((done) => {
      RabbitConnector.prototype.connect.restore()
      done()
    })

    it('should run connect', (done) => {
      RabbitConnector.prototype.connect.resolves()

      publisher.start().asCallback(() => {
        sinon.assert.calledOnce(RabbitConnector.prototype.connect)
        done()
      })
    })

    it('should have populated task list correctly', (done) => {
      RabbitConnector.prototype.connect.resolves()

      publisher.start().asCallback(() => {
        expect(publisher._publisher.tasks).to.be.an.array()
        publisher._publisher.tasks.forEach((item) => {
          expect(item).to.contain(['name', 'jobSchema'])
        })

        done()
      })
    })

    it('should have populated event list correctly', (done) => {
      RabbitConnector.prototype.connect.resolves()

      publisher.start().asCallback(() => {
        expect(publisher._publisher.events).to.equal(publishedEventList)
        done()
      })
    })
  }) // end start

  describe('publishEvent', () => {
    const testEvent = 'test.event'
    const testData = { msg: 'data' }

    beforeEach((done) => {
      sinon.stub(RabbitConnector.prototype, 'publishEvent')
      done()
    })

    afterEach((done) => {
      RabbitConnector.prototype.publishEvent.restore()
      done()
    })

    it('should call publishEvent', (done) => {
      publisher.publishEvent(testEvent, testData)
      sinon.assert.calledOnce(RabbitConnector.prototype.publishEvent)
      sinon.assert.calledWith(RabbitConnector.prototype.publishEvent, testEvent, testData)
      done()
    })
  }) // end publishEvent

  describe('publishTask', () => {
    const testTask = 'test.task'
    const testData = { msg: 'data' }

    beforeEach((done) => {
      sinon.stub(RabbitConnector.prototype, 'publishTask')
      done()
    })

    afterEach((done) => {
      RabbitConnector.prototype.publishTask.restore()
      done()
    })

    it('should call publishTask', (done) => {
      publisher.publishTask(testTask, testData)
      sinon.assert.calledOnce(RabbitConnector.prototype.publishTask)
      sinon.assert.calledWith(RabbitConnector.prototype.publishTask, testTask, testData)
      done()
    })
  }) // end publishTask
}) // end publisher.js unit test
