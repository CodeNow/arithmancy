'use strict'
const DatabaseError = require('errors/database-error')

/**
 * Error thrown when a not-null constraint is violated during a database insert.
 */
module.exports = class NotNullError extends DatabaseError {}
