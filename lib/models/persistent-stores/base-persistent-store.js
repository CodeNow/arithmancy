'use strict'
const NotImplemented = require('errors/not-implemented')

/**
 * Persistent storage classes need to extend this
 * @type {BasePersistentStore}
 */
module.exports = class BasePersistentStore {
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
  saveMetricEvent (metricEvent) {
    throw new NotImplemented()
  }
}
