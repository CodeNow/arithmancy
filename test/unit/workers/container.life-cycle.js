'use strict'
const Lab = require('lab')
const sinon = require('sinon')

const jobParser = require('utils/job-parser')
const Worker = require('workers/container.life-cycle')

require('sinon-as-promised')(require('bluebird'))
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it

describe('container.life-cycle', () => {
  const testJob = {
    Cave: 'Inimicum'
  }

  describe('static methods', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call parseContainerLifeCycleJob', (done) => {
      Worker._Worker.parseTags(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end static methods

  describe('instance methods', () => {
    let worker
    beforeEach((done) => {
      worker = new Worker._Worker(testJob)
      sinon.stub(jobParser, 'getEventName')
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.getEventName.restore()
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    describe('_parseTags', () => {
      it('should call parseContainerLifeCycleJob', (done) => {
        worker._parseTags()
        sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
        sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
        done()
      })
    }) // end _parseTags

    describe('_getEventName', () => {
      it('should call getEventName', (done) => {
        worker._getEventName()
        sinon.assert.calledOnce(jobParser.getEventName)
        sinon.assert.calledWith(jobParser.getEventName, testJob)
        done()
      })
    }) // end _getEventName
  }) // end instance methods
})
