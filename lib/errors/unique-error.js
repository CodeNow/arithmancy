'use strict'
const DatabaseError = require('errors/database-error')

/**
 * Error thrown when a uniqueness constraint is violated during a database
 * insert.
 */
module.exports = class UniqueError extends DatabaseError {}
