'use strict'
const url = require('url')

module.exports = class JobParser {
  /**
   * @param  {Object} instance
   * @return {Object}
   */
  static getInstanceTags (instance) {
    let instanceTags = {
      instanceId: instance.id,
      githubOrgId: instance.owner.github
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
    if (job.needsInspect) {
      return {
        branchName: job.inspectData.Config.Labels.instanceName,
        containerId: job.id,
        dockerHostIp: url.parse(job.host).hostname,
        githubOrgId: parseInt(job.inspectData.Config.Labels.githubOrgId, 10),
        githubUserId: parseInt(job.inspectData.Config.Labels.sessionUserGithubId, 10),
        isManualBuild: JobParser._isManualBuild(job)
      }
    }
    return {
      containerId: job.id,
      dockerHostIp: url.parse(job.host).hostname,
      githubOrgId: parseInt(job.org, 10)
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
  static parseDockEvent (job) {
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
