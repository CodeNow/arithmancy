'use strict'
const joi = require('joi')

const METRIC_EVENT_SCHEMA = joi.object({
  eventName: joi.string().required(),
  timePublished: joi.string().required(),
  timeRecevied: joi.string().required(),
  transactionId: joi.string().required(),
  publisherAppName: joi.string(),
  previousEventName: joi.string(),
  tags: joi.object({
    org: joi.string(),
    host: joi.string(),
    template: joi.string(),
    branch: joi.string(),
    stack: joi.string()
  })
}).required()

module.exports = class MetricEvent {
  constructor (event) {
    joi.assert(event, METRIC_EVENT_SCHEMA, 'Invalid MetricEvent data')
    this._event = event
  }

  /**
   * @return {MetricEvent}
   */
  getEventData () {
    return this._event
  }
}
