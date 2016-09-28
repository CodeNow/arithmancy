'use strict'
const DatabaseError = require('errors/database-error')

/**
 * Error thrown when a foreign key constraint is violated during a database
 * insert.
 */
module.exports = class ForeignKeyError extends DatabaseError {}
