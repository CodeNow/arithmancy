'use strict'
const NotImplemented = require('errors/not-implemented')

/**
 * Persistent storage classes need to inherit this
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
  save (metricEvent) {
    throw new NotImplemented()
  }
}
