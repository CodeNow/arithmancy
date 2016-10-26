'use strict'
const Code = require('code')
const keypather = require('keypather')()
const Lab = require('lab')
const Promise = require('bluebird')
const sinon = require('sinon')

const jobParser = require('utils/job-parser')
const JobParseError = require('errors/job-parse-error')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('job-parser unit test', () => {
  describe('parseWorkerJob', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'containerLifeCycleStarted')
      done()
    })

    afterEach((done) => {
      jobParser.containerLifeCycleStarted.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.parseWorkerJob('container.life-cycle.started', testJob)
      sinon.assert.calledOnce(jobParser.containerLifeCycleStarted)
      sinon.assert.calledWith(jobParser.containerLifeCycleStarted, testJob)
      done()
    })

    it('should throw JobParseError if parsing failed', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.containerLifeCycleStarted.throws(new Error('Geminio'))

      expect(() => {
        jobParser.parseWorkerJob('container.life-cycle.started', testJob)
      }).to.throw(JobParseError)
      done()
    })
  }) // end parseWorkerJob

  describe('applicationContainerCreated', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.applicationContainerCreated(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end applicationContainerCreated

  describe('applicationContainerDied', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.applicationContainerDied(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end applicationContainerDied

  describe('applicationContainerStarted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.applicationContainerStarted(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end applicationContainerStarted

  describe('buildContainerCreated', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.buildContainerCreated(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end buildContainerCreated

  describe('buildContainerDied', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.buildContainerDied(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end buildContainerDied

  describe('buildContainerStarted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.buildContainerStarted(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end buildContainerStarted

  describe('containerLifeCycleCreated', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.containerLifeCycleCreated(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end containerLifeCycleCreated

  describe('containerLifeCycleDied', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.containerLifeCycleDied(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end containerLifeCycleDied

  describe('containerLifeCycleStarted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseContainerLifeCycleJob')
      done()
    })

    afterEach((done) => {
      jobParser.parseContainerLifeCycleJob.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.containerLifeCycleStarted(testJob)
      sinon.assert.calledOnce(jobParser.parseContainerLifeCycleJob)
      sinon.assert.calledWith(jobParser.parseContainerLifeCycleJob, testJob)
      done()
    })
  }) // end containerLifeCycleStarted

  describe('dockDiskFilled', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'dockEvent')
      done()
    })

    afterEach((done) => {
      jobParser.dockEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.dockDiskFilled(testJob)
      sinon.assert.calledOnce(jobParser.dockEvent)
      sinon.assert.calledWith(jobParser.dockEvent, testJob)
      done()
    })
  }) // end dockDiskFilled

  describe('dockInitialized', () => {
    it('should call correct parser', (done) => {
      const testJob = { githubOrgId: 2828361, instanceId: 'i-99999999' }
      const tags = jobParser.dockInitialized(testJob)
      expect(tags).to.equal({
        githubOrgId: testJob.githubOrgId,
        instanceId: testJob.instanceId
      })
      done()
    })
  }) // end dockInitialized

  describe('dockMemoryExhausted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'dockEvent')
      done()
    })

    afterEach((done) => {
      jobParser.dockEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.dockMemoryExhausted(testJob)
      sinon.assert.calledOnce(jobParser.dockEvent)
      sinon.assert.calledWith(jobParser.dockEvent, testJob)
      done()
    })
  }) // end dockDiskFilled

  describe('dockLost', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'dockEvent')
      done()
    })

    afterEach((done) => {
      jobParser.dockEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.dockLost(testJob)
      sinon.assert.calledOnce(jobParser.dockEvent)
      sinon.assert.calledWith(jobParser.dockEvent, testJob)
      done()
    })
  }) // end dockLost

  describe('dockRemoved', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'dockEvent')
      done()
    })

    afterEach((done) => {
      jobParser.dockEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.dockRemoved(testJob)
      sinon.assert.calledOnce(jobParser.dockEvent)
      sinon.assert.calledWith(jobParser.dockEvent, testJob)
      done()
    })
  }) // end dockRemoved

  describe('dockUnresponsive', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'dockEvent')
      done()
    })

    afterEach((done) => {
      jobParser.dockEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.dockUnresponsive(testJob)
      sinon.assert.calledOnce(jobParser.dockEvent)
      sinon.assert.calledWith(jobParser.dockEvent, testJob)
      done()
    })
  }) // end dockUnresponsive

  describe('githubPushed', () => {
    it('should call correct parser', (done) => {
      const testJob = {
        payload: {
          repository: {
            name: 'Runnable/helloode',
            owner: {
              id: 12345
            }
          },
          sender: {
            id: 6789
          },
          ref: 'refs/heads/feature-1'
        }
      }
      const parsed = jobParser.githubPushed(testJob)
      expect(parsed).to.equal({
        githubOrgId: 12345,
        githubUserId: 6789,
        repoName: 'Runnable/helloode',
        branchName: 'feature-1'
      })
      done()
    })
  }) // end dockRemoved

  describe('instanceCreated', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getInstanceTags.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { instance: { Salvio: 'Hexia' } }
      jobParser.instanceCreated(testJob)
      sinon.assert.calledOnce(jobParser.getInstanceTags)
      sinon.assert.calledWith(jobParser.getInstanceTags, testJob.instance)
      done()
    })
  }) // end instanceCreated

  describe('instanceDeleted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getInstanceTags.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { instance: { Salvio: 'Hexia' } }
      jobParser.instanceDeleted(testJob)
      sinon.assert.calledOnce(jobParser.getInstanceTags)
      sinon.assert.calledWith(jobParser.getInstanceTags, testJob.instance)
      done()
    })
  }) // end instanceDeleted

  describe('instanceUpdated', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getInstanceTags.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { instance: { Salvio: 'Hexia' } }
      jobParser.instanceUpdated(testJob)
      sinon.assert.calledOnce(jobParser.getInstanceTags)
      sinon.assert.calledWith(jobParser.getInstanceTags, testJob.instance)
      done()
    })
  }) // end instanceUpdated

  describe('instanceDeployed', () => {
    it('should call correct parser', (done) => {
      const testJob = { instanceId: 'inst-1', cvId: 'cv-``' }
      const result = jobParser.instanceDeployed(testJob)
      expect(result).to.equal({
        instanceId: testJob.instanceId,
        contextVersionId: testJob.cvId
      })
      done()
    })
  }) // end instanceDeployed

  describe('instanceStarted', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'getInstanceTags')
      done()
    })

    afterEach((done) => {
      jobParser.getInstanceTags.restore()
      done()
    })
    it('should call correct parser', (done) => {
      const testJob = { instance: { Salvio: 'Hexia' } }
      jobParser.instanceStarted(testJob)
      sinon.assert.calledOnce(jobParser.getInstanceTags)
      sinon.assert.calledWith(jobParser.getInstanceTags, testJob.instance)
      done()
    })
  }) // end instanceStarted

  describe('stripeInvoiceCreated', () => {
    it('should call correct parser', (done) => {
      const testJob = { stripeCustomerId: 'cus1' }
      const result = jobParser.stripeInvoiceCreated(testJob)
      expect(result).to.equal({
        stripeCustomerId: testJob.stripeCustomerId
      })
      done()
    })
  }) // end stripeInvoiceCreated

  describe('stripeInvoicePaymentFailed', () => {
    it('should call correct parser', (done) => {
      const testJob = { stripeCustomerId: 'cus1' }
      const result = jobParser.stripeInvoicePaymentFailed(testJob)
      expect(result).to.equal({
        stripeCustomerId: testJob.stripeCustomerId
      })
      done()
    })
  }) // end stripeInvoicePaymentFailed

  describe('stripeInvoicePaymentSucceeded', () => {
    it('should call correct parser', (done) => {
      const testJob = { stripeCustomerId: 'cus1' }
      const result = jobParser.stripeInvoicePaymentSucceeded(testJob)
      expect(result).to.equal({
        stripeCustomerId: testJob.stripeCustomerId
      })
      done()
    })
  }) // end stripeInvoicePaymentSucceeded

  describe('organizationPaymentMethodAdded', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationPaymentMethod')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationPaymentMethod.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationPaymentMethodAdded(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationPaymentMethod)
      sinon.assert.calledWith(jobParser.parseOrganizationPaymentMethod, testJob)
      done()
    })
  }) // end organizationPaymentMethodAdded

  describe('organizationPaymentMethodRemoved', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationPaymentMethod')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationPaymentMethod.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationPaymentMethodRemoved(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationPaymentMethod)
      sinon.assert.calledWith(jobParser.parseOrganizationPaymentMethod, testJob)
      done()
    })
  }) // end organizationPaymentMethodRemoved

  describe('organizationTrialEnded', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationTrialEvent')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationTrialEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationTrialEnded(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationTrialEvent)
      sinon.assert.calledWith(jobParser.parseOrganizationTrialEvent, testJob)
      done()
    })
  }) // end organizationTrialEnded

  describe('organizationTrialEnding', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationTrialEvent')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationTrialEvent.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationTrialEnding(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationTrialEvent)
      sinon.assert.calledWith(jobParser.parseOrganizationTrialEvent, testJob)
      done()
    })
  }) // end organizationTrialEnding

  describe('organizationUserAdded', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationUserChange')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationUserChange.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationUserAdded(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationUserChange)
      sinon.assert.calledWith(jobParser.parseOrganizationUserChange, testJob)
      done()
    })
  }) // end organizationUserAdded

  describe('organizationUserRemoved', () => {
    beforeEach((done) => {
      sinon.stub(jobParser, 'parseOrganizationUserChange')
      done()
    })

    afterEach((done) => {
      jobParser.parseOrganizationUserChange.restore()
      done()
    })

    it('should call correct parser', (done) => {
      const testJob = { Salvio: 'Hexia' }
      jobParser.organizationUserRemoved(testJob)
      sinon.assert.calledOnce(jobParser.parseOrganizationUserChange)
      sinon.assert.calledWith(jobParser.parseOrganizationUserChange, testJob)
      done()
    })
  }) // end organizationUserRemoved

  describe('userWhitelisted', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        githubId: 1738
      }

      const tags = jobParser.userWhitelisted(testJob)

      expect(tags).to.equal({
        githubOrgId: testJob.githubId
      })
      done()
    })
  }) // end userWhitelisted

  describe('userAuthorized', () => {
    it('should parse tags correctly', (done) => {
      const testGithubUserId = 1738
      const testJob = {
        githubId: testGithubUserId
      }

      const tags = jobParser.userAuthorized(testJob)

      expect(tags).to.equal({
        githubUserId: testGithubUserId
      })
      done()
    })
  }) // end userAuthorized

  describe('organizationInvoicePaymentFailed', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        organization: {
          id: 123
        },
        paymentMethodOwner: {
          githubId: 999999
        }
      }

      const tags = jobParser.organizationInvoicePaymentFailed(testJob)

      expect(tags).to.equal({
        bigPoppaOrgId: testJob.organization.id,
        githubUserId: testJob.paymentMethodOwner.githubId
      })
      done()
    })
  }) // end organizationInvoicePaymentFailed

  describe('organizationIntegrationPrbotEnabled', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        organization: {
          id: 123
        }
      }

      const tags = jobParser.organizationIntegrationPrbotEnabled(testJob)

      expect(tags).to.equal({
        bigPoppaOrgId: testJob.organization.id
      })
      done()
    })
  }) // end organizationIntegrationPrbotEnabled

  describe('organizationCreated', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        organization: {
          id: 123,
          githubId: 88888
        },
        creator: {
          githubId: 999999
        }
      }

      const tags = jobParser.organizationCreated(testJob)

      expect(tags).to.equal({
        githubOrgId: testJob.organization.githubId,
        bigPoppaOrgId: testJob.organization.id,
        githubUserId: testJob.creator.githubId
      })
      done()
    })
  }) // end organizationCreated

  describe('parseOrganizationUserChange', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        organization: {
          id: 123,
          githubId: 88888
        },
        user: {
          id: 7777,
          githubId: 999999
        }
      }

      const tags = jobParser.parseOrganizationUserChange(testJob)

      expect(tags).to.equal({
        githubOrgId: testJob.organization.githubId,
        bigPoppaOrgId: testJob.organization.id,
        githubUserId: testJob.user.githubId,
        bigPoppaUserId: testJob.user.id
      })
      done()
    })
  }) // end parseOrganizationUserChange

  describe('organizationAuthorized', () => {
    it('should parse tags correctly', (done) => {
      const testGithubOrgId = 1738
      const testGithubUserId = 9999
      const testJob = {
        githubId: testGithubOrgId,
        creator: {
          githubId: testGithubUserId
        }
      }

      const tags = jobParser.organizationAuthorized(testJob)

      expect(tags).to.equal({
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId
      })
      done()
    })
  }) // end organizationAuthorized

  describe('firstDockCreated', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        githubId: 123,
        dockerHostIp: '10.2.3.4'
      }

      const tags = jobParser.firstDockCreated(testJob)

      expect(tags).to.equal({
        githubOrgId: testJob.githubId,
        dockerHostIp: testJob.dockerHostIp
      })
      done()
    })
  }) // end firstDockCreated

  describe('dockEvent', () => {
    it('should parse tags correctly', (done) => {
      const testDockerIp = '12.45.6.1'
      const testJob = {
        githubOrgId: 123,
        host: `http://${testDockerIp}:4242`
      }

      const tags = jobParser.dockEvent(testJob)

      expect(tags).to.equal({
        githubOrgId: testJob.githubOrgId,
        dockerHostIp: testDockerIp
      })
      done()
    })
  }) // end dockEvent

  describe('dockPurged', () => {
    it('should parse tags correctly', (done) => {
      const testOrgId = 1738
      const testDockerIp = '10.0.0.2'
      const testJob = {
        githubOrgId: testOrgId,
        ipAddress: testDockerIp
      }

      const tags = jobParser.dockPurged(testJob)

      expect(tags).to.equal({
        githubOrgId: testOrgId,
        dockerHostIp: testDockerIp
      })
      done()
    })
  }) // end dockPurged

  describe('parseOrganizationTrialEvent', () => {
    it('should parse tags correctly', (done) => {
      const testJob = {
        organization: {
          id: 123142
        }
      }

      const tags = jobParser.parseOrganizationTrialEvent(testJob)

      expect(tags).to.equal({
        bigPoppaOrgId: testJob.organization.id
      })
      done()
    })
  }) // end parseOrganizationTrialEvent

  describe('containerNetworkAttached', () => {
    it('should parse tags correctly', (done) => {
      const testBranchName = 'Obscuro'
      const testInstanceId = 'Obliviate'
      const testGithubOrgId = 12674
      const testGithubUserId = 1736
      const testDockerHostIp = '10.0.0.2'
      const testContainerType = 'user-container'
      const testJob = {
        id: '068a664de33cf2103f034c037ed93c571252a80a30231c04d748826643ab1a55',
        host: `http://${testDockerHostIp}:4242`,
        needsInspect: true,
        inspectData: {
          Config: {
            Labels: {
              instanceName: testBranchName,
              instanceId: testInstanceId,
              githubOrgId: testGithubOrgId,
              type: testContainerType,
              sessionUserGithubId: testGithubUserId
            }
          }
        }
      }

      const tags = jobParser.containerNetworkAttached(testJob)

      expect(tags).to.equal({
        branchName: testBranchName,
        instanceId: testInstanceId,
        containerId: testJob.id,
        dockerHostIp: testDockerHostIp,
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId,
        containerType: testContainerType,
        isManualBuild: undefined
      })
      done()
    })
  }) // end containerNetworkAttached

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
      const testInstanceId = 'Morsmorde'
      const testGithubOrgId = 12674
      const testGithubUserId = 1736
      const testDockerHostIp = '10.0.0.2'
      const testContainerType = 'user-container'
      const testJob = {
        id: '068a664de33cf2103f034c037ed93c571252a80a30231c04d748826643ab1a55',
        host: `http://${testDockerHostIp}:4242`,
        needsInspect: true,
        inspectData: {
          Config: {
            Labels: {
              instanceName: testBranchName,
              instanceId: testInstanceId,
              githubOrgId: testGithubOrgId,
              sessionUserGithubId: testGithubUserId,
              type: testContainerType,
              manualBuild: 'true'
            }
          }
        }
      }
      const result = jobParser.parseContainerLifeCycleJob(testJob)
      expect(result).to.equal({
        branchName: testBranchName,
        instanceId: testInstanceId,
        containerId: testJob.id,
        dockerHostIp: testDockerHostIp,
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId,
        containerType: testContainerType,
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
