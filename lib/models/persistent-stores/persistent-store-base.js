'use strict'
const NotImplemented = require('errors/not-implemented')

/**
 * all persistent storage classes need to inherit from here
 * super should be called only for the constructor
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
