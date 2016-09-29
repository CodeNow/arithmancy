'use strict'
const BasePersistentStore = require('models/persistent-stores/base-persistent-store')
const isString = require('101/is-string')
const knex = require('knex')
const Promise = require('bluebird')

const DatabaseError = require('errors/database-error')
const ForeignKeyError = require('errors/foreign-key-error')
const logger = require('logger')
const NoRowsDeletedError = require('errors/no-rows-deleted-error')
const NoRowsUpdatedError = require('errors/no-rows-updated-error')
const NotFoundError = require('errors/not-found-error')
const NotNullError = require('errors/not-null-error')
const UniqueError = require('errors/unique-error')

/**
 * Data forwarding classes need to extend this
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
   * @throws {NoRowsDeletedError} If model was not deleted
   * @throws {NotNullError}
   * @throws {ForeignKeyError}
   * @throws {UniqueError}
   */
  saveMetricEvent (metricEvent) {
    const log = logger.child({ metricEvent })
    log.info({ metricEvent }, 'saveMetricEvent called')

    const tableData = metricEvent.getDataInSnakeCase()

    return this._knex('events').insert(tableData)
  }

  /**
   * @param {Error} err - An error from any Bookshelf query
   * @throws {DatabaseError}
   * @throws {NotFoundError} If model not found in database
   * @throws {NoRowsUpdatedError} If not model was updated
   * @throws {NoRowsDeletedError} If model was not deleted
   * @throws {NotNullError}
   * @throws {ForeignKeyError}
   * @throws {UniqueError}
   */
  _castDatabaseError (err) {
    const log = logger.child({ err })
    log.info('_castDatabaseError called')

    this._checkForModelErrors(err)
    this._checkForSqlErrors(err)

    throw new DatabaseError(err)
  }

  /**
   * @param {Error} err
   * @throws {NotFoundError} If model not found in database
   * @throws {NoRowsUpdatedError} If not model was updated
   * @throws {NoRowsDeletedError} If model was not deleted
   */
  _checkForModelErrors (err) {
    if (err instanceof this._eventsModel.NotFoundError) {
      throw new NotFoundError('No instances of Events found in database', { err })
    }
    if (err instanceof this._eventsModel.NoRowsUpdatedError) {
      throw new NoRowsUpdatedError('No instances of Events updated in database', { err })
    }
    if (err instanceof this._eventsModel.NoRowsDeletedError) {
      throw new NoRowsDeletedError('No instances of Events deleted from database', { err })
    }
  }

  /**
   * SQLSTATE error codes are defined as strings of length 5, if this is not
   * the case we cannot determine a specific database error to handle and
   * should simply rethrow the error.
   *
   * see: http://www.contrib.andrew.cmu.edu/~shadow/sql/sql1992.txt
   * @param {Error} err
   * @throws {NotNullError}
   * @throws {ForeignKeyError}
   * @throws {UniqueError}
   */
  _checkForSqlErrors (err) {
    if (!isString(err.code) || err.code.length !== 5) {
      throw err
    }
    switch (err.code) {
      case '23502':
        throw new NotNullError(err)
      case '23503':
        throw new ForeignKeyError(err)
      case '23505':
        throw new UniqueError(err)
    }
  }
}

module.exports = new PostgreStore()
