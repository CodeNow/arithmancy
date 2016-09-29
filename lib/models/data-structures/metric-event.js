'use strict'
const joi = require('joi')
const stringcase = require('stringcase')

const METRIC_EVENT_SCHEMA = joi.object({
  eventName: joi.string().required(),
  appName: joi.string().required(),
  timePublished: joi.string().required(),
  timeRecevied: joi.string().required(),
  transactionId: joi.string().required().description('ID used to join events together'),
  previousEventName: joi.string(),
  // tags
  githubOrgId: joi.number().integer(),
  githubUserId: joi.number().integer(),
  bigPoppaOrgId: joi.number().integer(),
  dockerHostIp: joi.string(),
  masterInstanceId: joi.string(),
  repoName: joi.string(),
  branchName: joi.string()
}).required()

module.exports = class MetricEvent {
  constructor (event) {
    joi.assert(event, METRIC_EVENT_SCHEMA, 'Invalid MetricEvent data')
    this._event = event
  }

  /**
   * @return {Object} MetricEvent in camelCase
   */
  getEventData () {
    return this._event
  }

  /**
   * @return {Object} MetricEvent in snake_case
   */
  getDataInSnakeCase () {
    return Object.keys(this._event).reduce((output, key) => {
      output[stringcase.snakecase(key)] = this._event[key]
      return output
    }, {})
  }
}

module.exports._METRIC_EVENT_SCHEMA = METRIC_EVENT_SCHEMA
