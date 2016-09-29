'use strict'
const BasePersistentStore = require('models/persistent-stores/base-persistent-store')
const isString = require('101/is-string')
const knex = require('knex')
const Promise = require('bluebird')

const DatabaseError = require('errors/database-error')
const logger = require('logger')
const NotNullError = require('errors/not-null-error')
const UniqueError = require('errors/unique-error')

/**
 * Persistent Store backed by postegre database
 * @type {PostgreStore}
 */
class PostgreStore extends BasePersistentStore {
  /**
   * @return {Promise}
   * @throws {Error} If not initialized
   */
  initialize () {
    return Promise.try(() => {
      this._knex = knex({
        client: 'pg',
        connection: process.env.POSTGRES_CONNECT_STRING,
        pool: {
          min: process.env.POSTGRES_POOL_MIN,
          max: process.env.POSTGRES_POOL_MAX
        }
      })
    })
  }

  /**
   * @param {MetricEvent} metricEvent
   * @return {Promise}
   * @param {Error} err - An error from any Bookshelf query
   * @throws {DatabaseError}
   * @throws {NotFoundError} If model not found in database
   * @throws {NoRowsUpdatedError} If not model was updated
   * @throws {NotNullError}
   * @throws {UniqueError}
   */
  saveMetricEvent (metricEvent) {
    const log = logger.child({ metricEvent })
    log.info({ metricEvent }, 'saveMetricEvent called')

    const tableData = metricEvent.getDataInSnakeCase()

    return this._knex('events')
      .insert(tableData)
      .catch(this._castDatabaseError.bind(this))
  }

  /**
   * @param {Error} err - An error from any Bookshelf query
   * @throws {DatabaseError}
   * @throws {NotFoundError} If model not found in database
   * @throws {NoRowsUpdatedError} If not model was updated
   * @throws {NotNullError}
   * @throws {UniqueError}
   */
  _castDatabaseError (err) {
    const log = logger.child({ err })
    log.info('_castDatabaseError called')
    if (!this._isSqlError(err)) {
      this._checkForSqlErrors(err)
    }

    throw new DatabaseError(err)
  }

  /**
   * SQLSTATE error codes are defined as strings of length 5
   * see: http://www.contrib.andrew.cmu.edu/~shadow/sql/sql1992.txt
   *
   * @param {Error} err
   * @return {Boolean}
   */
  _isSqlError (err) {
    return !isString(err.code) || err.code.length !== 5
  }

  /**
   * @param {Error} err
   * @throws {NotNullError}
   * @throws {UniqueError}
   */
  _checkForSqlErrors (err) {
    switch (err.code) {
      case '23502':
        throw new NotNullError(err)
      case '23505':
        throw new UniqueError(err)
    }
  }
}

module.exports = new PostgreStore()
