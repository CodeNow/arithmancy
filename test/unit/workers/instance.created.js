'use strict'
const Code = require('code')
const Lab = require('lab')
const sinon = require('sinon')

const jobParser = require('utils/job-parser')
const Worker = require('workers/instance.created')

require('sinon-as-promised')(require('bluebird'))
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('instance.created', () => {
  const testInstance = {
    Homenum: 'Revelio'
  }
  const testJob = {
    instance: testInstance
  }

  describe('static methods', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getInstanceTags.restore()
      done()
    })

    it('should call getInstanceTags', (done) => {
      Worker._Worker.parseTags(testJob)
      sinon.assert.calledOnce(jobParser.getInstanceTags)
      sinon.assert.calledWith(jobParser.getInstanceTags, testInstance)
      done()
    })
  }) // end static methods

  describe('instance methods', () => {
    let worker
    beforeEach((done) => {
      worker = new Worker._Worker(testJob)
      sinon.stub(jobParser, 'getEventName')
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getEventName.restore()
      jobParser.getInstanceTags.restore()
      done()
    })

    describe('_parseTags', () => {
      it('should call getInstanceTags', (done) => {
        worker._parseTags()
        sinon.assert.calledOnce(jobParser.getInstanceTags)
        sinon.assert.calledWith(jobParser.getInstanceTags, testInstance)
        done()
      })
    }) // end _parseTags

    describe('_getEventName', () => {
      it('should call getEventName', (done) => {
        const result = worker._getEventName()
        expect(result).to.equal('instance.created')
        done()
      })
    }) // end _getEventName
  }) // end instance methods
})
