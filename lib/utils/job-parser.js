'use strict'

const url = require('url')
const keypather = require('keypather')()
const stringcase = require('stringcase')

const JobParseError = require('errors/job-parse-error')
const WorkerStopError = require('error-cat/errors/worker-stop-error')

module.exports = class JobParser {
  static parseWorkerJob (workerName, job) {
    const parserName = stringcase.camelcase(workerName)
    try {
      return JobParser[parserName](job)
    } catch (err) {
      throw new JobParseError(err)
    }
  }

  static applicationContainerCreated (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static applicationContainerDied (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static applicationContainerStarted (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static autoIsolationConfigCreated (job) {
    return {
      bigPoppaOrgId: job.organization.id,
      bigPoppaUserId: job.user.id
    }
  }

  static buildContainerCreated (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static buildContainerDied (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static buildContainerStarted (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static containerNetworkAttached (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static containerLifeCycleStarted (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static containerLifeCycleDied (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static containerLifeCycleCreated (job) {
    return JobParser.parseContainerLifeCycleJob(job)
  }

  static dockDiskFilled (job) {
    return JobParser.dockEvent(job)
  }

  static dockInitialized (job) {
    return {
      githubOrgId: job.githubOrgId,
      instanceId: job.instanceId
    }
  }

  static dockLost (job) {
    return JobParser.dockEvent(job)
  }

  static dockMemoryExhausted (job) {
    return JobParser.dockEvent(job)
  }

  static dockRemoved (job) {
    return JobParser.dockEvent(job)
  }

  static dockUnresponsive (job) {
    return JobParser.dockEvent(job)
  }

  static githubPushed (job) {
    const githubOrgId = keypather.get(job, 'payload.repository.owner.id') || keypather.get(job, 'payload.organization.id')
    const githubUserId = job.payload.sender.id
    const repoName = job.payload.repository.full_name
    const branchName = job.payload.ref.replace('refs/heads/', '')
    return {
      githubOrgId,
      githubUserId,
      repoName,
      branchName
    }
  }
  static instanceCreated (job) {
    return JobParser.getInstanceTags(job.instance)
  }

  static instanceDeleted (job) {
    return JobParser.getInstanceTags(job.instance)
  }

  static instanceUpdated (job) {
    return JobParser.getInstanceTags(job.instance)
  }

  static instanceDeployed (job) {
    return {
      instanceId: job.instanceId,
      contextVersionId: job.cvId
    }
  }

  static instanceStarted (job) {
    return JobParser.getInstanceTags(job.instance)
  }

  static organizationPaymentMethodAdded (job) {
    return JobParser.parseOrganizationPaymentMethod(job)
  }

  static organizationPaymentMethodRemoved (job) {
    return JobParser.parseOrganizationPaymentMethod(job)
  }

  static organizationTrialEnded (job) {
    return JobParser.parseOrganizationTrialEvent(job)
  }

  static organizationTrialEnding (job) {
    return JobParser.parseOrganizationTrialEvent(job)
  }

  static organizationUserAdded (job) {
    return JobParser.parseOrganizationUserChange(job)
  }

  static organizationUserRemoved (job) {
    return JobParser.parseOrganizationUserChange(job)
  }

  static organizationInvoicePaymentFailed (job) {
    return JobParser.parseOrganizationPaymentMethod(job)
  }

  static userAuthorized (job) {
    return {
      githubUserId: job.githubId
    }
  }

  static stripeInvoiceCreated (job) {
    return {
      stripeCustomerId: job.stripeCustomerId
    }
  }
  static stripeInvoicePaymentFailed (job) {
    return {
      stripeCustomerId: job.stripeCustomerId
    }
  }
  static stripeInvoicePaymentSucceeded (job) {
    return {
      stripeCustomerId: job.stripeCustomerId
    }
  }

  static organizationIntegrationPrbotEnabled (job) {
    return {
      bigPoppaOrgId: job.organization.id
    }
  }

  static organizationCreated (job) {
    return {
      bigPoppaOrgId: job.organization.id,
      githubOrgId: job.organization.githubId,
      githubUserId: job.creator.githubId
    }
  }

  static organizationAuthorized (job) {
    return {
      githubOrgId: job.githubId,
      githubUserId: job.creator.githubId
    }
  }

  static firstDockCreated (job) {
    return {
      githubOrgId: job.githubId,
      dockerHostIp: job.dockerHostIp
    }
  }

  static dockPurged (job) {
    return {
      githubOrgId: job.githubOrgId,
      dockerHostIp: job.ipAddress
    }
  }

  /**
   * @param  {Object} instance
   * @return {Object}
   */
  static getInstanceTags (instance) {
    let instanceTags = {
      githubOrgId: instance.owner.github,
      instanceId: instance.id,
      shortHash: instance.shortHash
    }

    if (instance.masterPod) {
      instanceTags.masterInstanceId = instance.id
    }

    const contextVersionTags = JobParser.getTagsFromKeys(
      instance.contextVersion,
      JobParser.getContextVersionTags
    )

    return Object.assign(instanceTags, contextVersionTags)
  }

  /**
   * @param  {Object} keysToParse
   * @param  {Function} keyParser
   * @return {Object}
   */
  static getTagsFromKeys (keysToParse, keyParser) {
    return keysToParse ? keyParser(keysToParse) : {}
  }

  /**
   * @param  {Object[]} contextVersion
   * @return {Object}
   */
  static getContextVersionTags (contextVersion) {
    const contextVersionTags = {
      contextVersionId: contextVersion.id
    }
    const appCodeTags = JobParser.getTagsFromKeys(
      contextVersion.appCodeVersions,
      JobParser.getAppCodeVersionTags
    )

    return Object.assign(contextVersionTags, appCodeTags)
  }

  /**
   * @param  {Object[]} appCodeVersions
   * @return {Object}
   */
  static getAppCodeVersionTags (appCodeVersions) {
    const mainAppCodeVersion = appCodeVersions.find((a) => {
      return !a.additionalRepo
    })
    if (!mainAppCodeVersion) { return {} }

    return {
      repoName: mainAppCodeVersion.repo,
      branchName: mainAppCodeVersion.branch
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static parseContainerLifeCycleJob (job) {
    if (!job.needsInspect) {
      return {
        containerId: job.id,
        dockerHostIp: url.parse(job.host).hostname,
        githubOrgId: parseInt(job.org, 10)
      }
    }
    const containerType = keypather.get(job, 'inspectData.Config.Labels.type')
    if (['user-container', 'image-builder-container'].indexOf(containerType) === -1) {
      throw new WorkerStopError('Ignore events for utility container types', { containerType: containerType }, { level: 'info' })
    }
    return {
      branchName: job.inspectData.Config.Labels.instanceName,
      instanceId: job.inspectData.Config.Labels.instanceId,
      containerId: job.id,
      dockerHostIp: url.parse(job.host).hostname,
      githubOrgId: parseInt(job.inspectData.Config.Labels.githubOrgId, 10),
      githubUserId: parseInt(job.inspectData.Config.Labels.sessionUserGithubId, 10),
      isManualBuild: JobParser._isManualBuild(job),
      containerType: containerType
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static parseOrganizationPaymentMethod (job) {
    return {
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.paymentMethodOwner.githubId
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static parseOrganizationUserChange (job) {
    return {
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static dockEvent (job) {
    return {
      githubOrgId: job.githubOrgId,
      dockerHostIp: url.parse(job.host).hostname
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static parseOrganizationTrialEvent (job) {
    return {
      bigPoppaOrgId: job.organization.id
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static applicationUrlVisited (job) {
    return {
      elasticUrl: job.elasticUrl,
      githubOrgId: job.ownerGithubId,
      githubOrgUsername: job.ownerUsername,
      referer: job.referer,
      refererIsGithub: job.refererIsGithub,
      shortHash: job.shortHash,
      naviTargetHost: job.targetHost
    }
  }

  static mapGithubBranch (job) {
    return {
      branchName: job.payload.ref,
      githubOrgId: job.payload.repository.owner.id,
      githubOrgUsername: job.payload.repository.owner.login,
      githubUserId: job.payload.sender.id,
      repoName: job.payload.repository.full_name.split('/')[1]
    }
  }

  static githubBranchCreated (job) {
    return JobParser.mapGithubBranch(job)
  }

  static githubBranchDeleted (job) {
    return JobParser.mapGithubBranch(job)
  }

  static mapPullRequestEvent (job) {
    return {
      branchName: job.payload.pull_request.head.ref,
      githubOrgId: job.payload.repository.owner.id,
      githubOrgUsername: job.payload.repository.owner.login,
      githubPullRequestNumber: job.payload.number,
      githubUserId: job.payload.sender.id,
      repoName: job.payload.pull_request.head.repo.full_name.split('/')[1]
    }
  }

  static githubPullRequestAssigned (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestUnassigned (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestReviewRequested (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestReviewRequestRemoved (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestLabeled (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestUnlabeled (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestOpened (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestEdited (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestClosed (job) {
    return JobParser.mapPullRequestEvent(job)
  }

  static githubPullRequestReopened (job) {
    return JobParser.mapPullRequestEvent(job)
  }
  static mapStreamEvent (job) {
    const instanceTags = JobParser.getInstanceTags(job.instance)
    const userOrgTags = {
      githubOrgUsername: job.organization.ownerUsername,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    }
    const containerTags = {
      containerId: job.container.id
    }
    return Object.assign({}, instanceTags, userOrgTags, containerTags)
  }
  static terminalConected (job) {
    return JobParser.mapStreamEvent(job)
  }
  static terminalDataSent (job) {
    return JobParser.mapStreamEvent(job)
  }
  static logstreamConnected (job) {
    return JobParser.mapStreamEvent(job)
  }

  /**
   * @return {Boolean|undefined}
   */
  static _isManualBuild (job) {
    switch (job.inspectData.Config.Labels.manualBuild) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return undefined
    }
  }
}
