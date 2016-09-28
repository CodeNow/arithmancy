'use strict'
const DatabaseError = require('errors/database-error')

/**
 * Error thrown when no rows are updated on a update operation
 */
module.exports = class NoRowsUpdatedError extends DatabaseError {}
