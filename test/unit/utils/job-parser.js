'use strict'
const Code = require('code')
const keypather = require('keypather')()
const Lab = require('lab')
const Promise = require('bluebird')

const jobParser = require('utils/job-parser')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('job-parser unit test', () => {
  describe('getEventName', () => {
    let testJob

    describe('image-builder events', () => {
      beforeEach((done) => {
        testJob = {}
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'image-builder-container')
        done()
      })

      it('should return started', (done) => {
        keypather.set(testJob, 'Action', 'start')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('container.image-builder.started')
        done()
      })

      it('should return died', (done) => {
        keypather.set(testJob, 'Action', 'die')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('container.image-builder.died')
        done()
      })

      it('should return created', (done) => {
        keypather.set(testJob, 'Action', 'create')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('container.image-builder.created')
        done()
      })

      it('should return null', (done) => {
        keypather.set(testJob, 'Action', 'random')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal(null)
        done()
      })
    }) // end image-builder containers

    describe('container events', () => {
      beforeEach((done) => {
        testJob = {}
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'user-container')
        done()
      })

      it('should return started', (done) => {
        keypather.set(testJob, 'Action', 'start')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('instance.container.started')
        done()
      })

      it('should return died', (done) => {
        keypather.set(testJob, 'Action', 'die')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('instance.container.died')
        done()
      })

      it('should return created', (done) => {
        keypather.set(testJob, 'Action', 'create')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal('instance.container.created')
        done()
      })

      it('should return null', (done) => {
        keypather.set(testJob, 'Action', 'random')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal(null)
        done()
      })
    }) // end image-builder containers

    describe('invalid container', () => {
      it('should return null', (done) => {
        testJob = {}
        keypather.set(testJob, 'inspectData.Config.Labels.type', 'Avifors')
        const result = jobParser.getEventName(testJob)
        expect(result).to.equal(null)
        done()
      })
    }) // end invalid container
  }) // end getEventName

  describe('_isManualBuild', () => {
    it('should return true', (done) => {
      let testJob = {}
      keypather.set(testJob, 'inspectData.Config.Labels.manualBuild', 'true')
      const result = jobParser._isManualBuild(testJob)
      expect(result).to.equal(true)
      done()
    })

    it('should return false', (done) => {
      let testJob = {}
      keypather.set(testJob, 'inspectData.Config.Labels.manualBuild', 'false')
      const result = jobParser._isManualBuild(testJob)
      expect(result).to.equal(false)
      done()
    })

    it('should return undefined', (done) => {
      let testJob = {}
      keypather.set(testJob, 'inspectData.Config.Labels.manualBuild', 'undefined')
      const result = jobParser._isManualBuild(testJob)
      expect(result).to.equal(undefined)
      done()
    })
  }) // end _isManualBuild

  describe('parseContainerLifeCycleJob', () => {
    it('should return formatted data', (done) => {
      const testBranchName = 'Avis'
      const testGithubOrgId = 12674
      const testGithubUserId = 1736
      const testDockerHostIp = '10.0.0.2'
      const testJob = {
        host: `http://${testDockerHostIp}:4242`,
        inspectData: {
          Config: {
            Labels: {
              instanceName: testBranchName,
              githubOrgId: testGithubOrgId,
              sessionUserGithubId: testGithubUserId,
              manualBuild: 'true'
            }
          }
        }
      }
      const result = jobParser.parseContainerLifeCycleJob(testJob)
      expect(result).to.equal({
        branchName: testBranchName,
        dockerHostIp: testDockerHostIp,
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId,
        isManualBuild: true
      })
      done()
    })
  }) // end parseContainerLifeCycleJob
}) // end job-parser unit test
