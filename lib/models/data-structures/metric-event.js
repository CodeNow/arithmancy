'use strict'
const joi = require('joi')
const omit = require('101/omit')
const stringcase = require('stringcase')

const InvalidMetricEvent = require('errors/invalid-metric-event')

const METRIC_EVENT_SCHEMA = joi.object({
  eventName: joi.string().required(),
  appName: joi.string().required(),
  timePublished: joi.date().timestamp().required(),
  timeRecevied: joi.date().timestamp().required(),
  transactionId: joi.string().required().description('ID used to join events together'),
  previousEventName: joi.string(),
  // tags
  bigPoppaOrgId: joi.number().integer(),
  branchName: joi.string(),
  containerId: joi.string(),
  dockerHostIp: joi.string(),
  githubOrgId: joi.number().integer(),
  githubUserId: joi.number().integer(),
  bigPoppaUserId: joi.number().integer(),
  instanceId: joi.string(),
  contextVersionId: joi.string(),
  isManualBuild: joi.boolean(),
  isWorkerSuccessfull: joi.boolean().default(true),
  masterInstanceId: joi.string(),
  repoName: joi.string()
}).required()

module.exports = class MetricEvent {
  constructor (event) {
    const validatedEvent = joi.validate(event, METRIC_EVENT_SCHEMA, {
      stripUnknown: true,
      convert: true
    })

    if (validatedEvent.error) {
      throw new InvalidMetricEvent(validatedEvent.error)
    }

    this._event = validatedEvent.value
  }

  /**
   * @return {Object} MetricEvent in camelCase
   */
  getEventData () {
    return this._event
  }

  /**
   * @return {Object} non-null tag values
   */
  getTags () {
    return omit(this._event, ['timePublished', 'timeRecevied', 'transactionId'])
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
