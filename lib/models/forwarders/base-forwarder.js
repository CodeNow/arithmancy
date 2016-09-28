'use strict'
const NotImplemented = require('errors/not-implemented')

/**
 * Data forwarding classes need to inherit this
 * @type {BaseForwarder}
 */
module.exports = class BaseForwarder {
  /**
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  initialize () {
    throw new NotImplemented()
  }

  /**
   * @param {MetricEvent} metricEvent
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  sendMetricEvent (metricEvent) {
    throw new NotImplemented()
  }
}
