'use strict'
const BaseError = require('error-cat/errors/base-error')

/**
 * Base class for all database related errors
 */
module.exports = class DatabaseError extends BaseError {
  /**
   * Constructs the database error given a vanilla knex error or an error message.
   *
   * @param {Error}  error
   * @param {Object}  data
   */
  constructor (error) {
    super('Database Error: ' + error.message)
  }
}
