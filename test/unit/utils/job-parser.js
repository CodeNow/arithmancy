'use strict'
const Code = require('code')
const keypather = require('keypather')()
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const jobParser = require('utils/job-parser')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('job-parser unit test', () => {
  describe('getAppCodeVersionTags', () => {
    const testRepo = 'Aguamenti'
    const testBranch = 'Alohomora'
    const testJob = [{
      repo: testRepo,
      branch: testBranch
    }]

    it('should return repo and branch', (done) => {
      const result = jobParser.getAppCodeVersionTags(testJob)
      expect(result).to.equal({
        repoName: testRepo,
        branchName: testBranch
      })
      done()
    })

    it('should return {}', (done) => {
      const result = jobParser.getAppCodeVersionTags([])
      expect(result).to.equal({})
      done()
    })
  }) // end getAppCodeVersionTags

  describe('getContextVersionTags', () => {
    const testId = '1233245'
    const testAppCodeVersion = {
      Expecto: 'Patronum'
    }
    let testJob

    beforeEach((done) => {
      testJob = { id: testId }
      sinon.stub(jobParser, 'getAppCodeVersionTags')
      done()
    })

    afterEach((done) => {
      jobParser.getAppCodeVersionTags.restore()
      done()
    })

    it('should fill contextVersionId', (done) => {
      const result = jobParser.getContextVersionTags(testJob)
      expect(result).to.equal({
        contextVersionId: testId
      })
      done()
    })

    it('should fill getAppCodeVersionTags', (done) => {
      testJob.appCodeVersions = [testAppCodeVersion]
      jobParser.getAppCodeVersionTags.returns(testAppCodeVersion)
      const result = jobParser.getContextVersionTags(testJob)
      expect(result).to.equal({
        contextVersionId: testId,
        Expecto: 'Patronum'
      })
      sinon.assert.calledOnce(jobParser.getAppCodeVersionTags)
      sinon.assert.calledWith(jobParser.getAppCodeVersionTags, testJob.appCodeVersions)
      done()
    })
  }) // end getContextVersionTags

  describe('getInstanceTags', () => {
    const testId = '1231234'
    const testOwnerId = 1738
    let testJob

    beforeEach((done) => {
      testJob = { id: testId, owner: { github: testOwnerId } }
      sinon.stub(jobParser, 'getContextVersionTags')
      done()
    })

    afterEach((done) => {
      jobParser.getContextVersionTags.restore()
      done()
    })

    it('should return basic tags', (done) => {
      const result = jobParser.getInstanceTags(testJob)
      expect(result).to.equal({
        instanceId: testId,
        githubOrgId: testOwnerId
      })
      done()
    })

    it('should add masterInstanceId', (done) => {
      testJob.masterPod = true

      const result = jobParser.getInstanceTags(testJob)
      expect(result).to.equal({
        instanceId: testId,
        masterInstanceId: testId,
        githubOrgId: testOwnerId
      })
      done()
    })

    it('should add ContextVersionTags', (done) => {
      const testContextVersion = {
        contextVersionId: testId
      }
      testJob.contextVersion = testContextVersion
      jobParser.getContextVersionTags.returns(testContextVersion)

      const result = jobParser.getInstanceTags(testJob)
      expect(result).to.equal({
        instanceId: testId,
        contextVersionId: testId,
        githubOrgId: testOwnerId
      })
      sinon.assert.calledOnce(jobParser.getContextVersionTags)
      sinon.assert.calledWith(jobParser.getContextVersionTags, testContextVersion)
      done()
    })
  }) // end getInstanceTags

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
    it('should return formatted data if needsInspect=true', (done) => {
      const testBranchName = 'Avis'
      const testGithubOrgId = 12674
      const testGithubUserId = 1736
      const testDockerHostIp = '10.0.0.2'
      const testJob = {
        id: '068a664de33cf2103f034c037ed93c571252a80a30231c04d748826643ab1a55',
        host: `http://${testDockerHostIp}:4242`,
        needsInspect: true,
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
        containerId: testJob.id,
        dockerHostIp: testDockerHostIp,
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId,
        isManualBuild: true
      })
      done()
    })
    it('should return formatted data if needsInspect=false', (done) => {
      const testGithubOrgId = 12674
      const testDockerHostIp = '10.0.0.2'
      const testJob = {
        id: '068a664de33cf2103f034c037ed93c571252a80a30231c04d748826643ab1a55',
        host: `http://${testDockerHostIp}:4242`,
        needsInspect: false,
        org: testGithubOrgId
      }
      const result = jobParser.parseContainerLifeCycleJob(testJob)
      expect(result).to.equal({
        containerId: testJob.id,
        dockerHostIp: testDockerHostIp,
        githubOrgId: testGithubOrgId
      })
      done()
    })
  }) // end parseContainerLifeCycleJob
}) // end job-parser unit test
