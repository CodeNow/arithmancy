'use strict'
const monitor = require('monitor-dog')

const BaseForwarder = require('models/forwarders/base-forwarder')

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
    this._datadogClient = monitor
  }

  /**
   * @param {MetricEvent} metricEvent
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  sendMetricEvent (metricEvent) {
    const eventData = metricEvent.getEventData()
    this._datadogClient.increment(eventData.name, eventData.tags)
  }
}

module.exports = new DatadogForwarder()
