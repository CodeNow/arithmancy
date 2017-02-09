'use strict'
const joi = require('joi')
const omit = require('101/omit')
const stringcase = require('stringcase')

const InvalidMetricEvent = require('errors/invalid-metric-event')

const METRIC_EVENT_SCHEMA = joi.object({
  appName: joi.string().required(),
  eventName: joi.string().required(),
  previousEventName: joi.string(),
  timePublished: joi.date().timestamp().required(),
  timeRecevied: joi.date().timestamp().required(),
  transactionId: joi.string().required().description('ID used to join events together'),
  // tags
  bigPoppaOrgId: joi.number().integer(),
  bigPoppaUserId: joi.number().integer(),
  branchName: joi.string(),
  containerId: joi.string(),
  containerType: joi.string(),
  contextVersionId: joi.string(),
  dockerHostIp: joi.string(),
  elasticUrl: joi.string(),
  githubOrgId: joi.number().integer(),
  githubOrgUsername: joi.string(),
  githubUserId: joi.number().integer(),
  instanceId: joi.string(),
  isManualBuild: joi.boolean(),
  isWorkerSuccessfull: joi.boolean().default(true),
  masterInstanceId: joi.string(),
  referer: joi.string(),
  repoName: joi.string(),
  shortHash: joi.string(),
  stripeCustomerId: joi.string(),
  targetHost: joi.string()
}).required()

module.exports = class MetricEvent {
  constructor (event) {
    const cleanedEvent = MetricEvent._removeInvalidKeys(event)
    const validatedEvent = joi.validate(cleanedEvent, METRIC_EVENT_SCHEMA, {
      stripUnknown: true,
      convert: true
    })

    if (validatedEvent.error) {
      throw new InvalidMetricEvent(validatedEvent.error, event)
    }

    this._event = validatedEvent.value
  }

  static _removeInvalidKeys (event) {
    return Object.keys(event).reduce((outObject, currentKey) => {
      if (MetricEvent._isValid(event[currentKey])) {
        outObject[currentKey] = event[currentKey]
      }
      return outObject
    }, {})
  }

  /**
   * a valid value is not null, undefined or Nan
   * @param  {any}  value
   * @return {Boolean}
   */
  static _isValid (value) {
    return !(value === null || value === undefined || Number.isNaN(value))
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
