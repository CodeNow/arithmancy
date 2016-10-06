'use strict'
const expect = require('code').expect
const keypather = require('keypather')()
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
  let testJob

  beforeEach((done) => {
    testJob = {
      Cave: 'Inimicum'
    }
    done()
  })

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
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
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

    describe('_shouldIgnore', () => {
      it('should return false', (done) => {
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'image-builder-container')
        const result = worker._shouldIgnore()
        expect(result).to.be.false()
        done()
      })

      it('should return false', (done) => {
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'user-container')
        const result = worker._shouldIgnore()
        expect(result).to.be.false()
        done()
      })

      it('should return true', (done) => {
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'random')
        const result = worker._shouldIgnore()
        expect(result).to.be.true()
        done()
      })

      it('should return true if type path does not exist', (done) => {
        const result = worker._shouldIgnore()
        expect(result).to.be.true()
        done()
      })
    }) // end _shouldIgnore
  }) // end instance methods
})
