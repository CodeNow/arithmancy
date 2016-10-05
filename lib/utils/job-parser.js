'use strict'
const url = require('url')
const keypather = require('keypather')()

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
  static getEventName (job) {
    let eventName

    try {
      const type = JobParser._getEventType(job)
      const state = JobParser._getEventState(job)
      eventName = `${type}.${state}`
    } catch (err) {
      return null
    }

    return eventName
  }

  static _getEventType (job) {
    const eventType = keypather.get(job, 'inspectData.Config.Labels.type')
    if (eventType === 'image-builder-container') {
      return 'container.image-builder'
    } else if (eventType === 'user-container') {
      return 'instance.container'
    }

    throw new Error('invalid event type')
  }

  static _getEventState (job) {
    const eventState = keypather.get(job, 'Action')
    switch (eventState) {
      case 'start':
        return 'started'
      case 'die':
        return 'died'
      case 'create':
        return 'created'
      default:
        throw new Error('invalid event state')
    }
  }

  /**
   * @param  {Object} job
   * @return {Object}
   */
  static parseContainerLifeCycleJob (job) {
    return {
      branchName: job.inspectData.Config.Labels.instanceName,
      dockerHostIp: url.parse(job.host).hostname,
      githubOrgId: parseInt(job.inspectData.Config.Labels.githubOrgId, 10),
      githubUserId: parseInt(job.inspectData.Config.Labels.sessionUserGithubId, 10),
      isManualBuild: JobParser._isManualBuild(job)
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
      githubOrgId: job.githubOrgId
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
