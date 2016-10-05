'use strict'
const url = require('url')
const keypather = require('keypather')()

module.exports = class JobParser {
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
