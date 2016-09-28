'use strict'
const monitor = require('monitor-dog')
const Promise = require('bluebird')

const BaseForwarder = require('models/forwarders/base-forwarder')
const logger = require('logger')

/**
 * Data forwarding classes need to extend this
 * @type {DatadogForwarder}
 */
class DatadogForwarder extends BaseForwarder {
  /**
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  initialize () {
    return Promise.try(() => {
      this._datadogClient = monitor
    })
  }

  /**
   * @param {MetricEvent} metricEvent
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  sendMetricEvent (metricEvent) {
    const log = logger.child({ metricEvent })
    log.info('sendMetricEvent called')

    return Promise.try(() => {
      const eventData = metricEvent.getEventData()
      this._datadogClient.increment(eventData.name, eventData.tags)
    })
  }
}

module.exports = new DatadogForwarder()
