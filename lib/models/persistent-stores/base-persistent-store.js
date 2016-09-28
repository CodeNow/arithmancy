'use strict'
const NotImplemented = require('errors/not-implemented')

/**
 * Persistent storage classes need to inherit this
 * @type {PersistentStoreBase}
 */
module.exports = class PersistentStoreBase {
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
