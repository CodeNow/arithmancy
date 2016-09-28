'use strict'
const log = require('logger').child({ migration: 'create_events_table' })

exports.up = function(knex, Promise) {
  const createTable = knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    table.timestamps(false)
    table.string('eventName')
    table.string('timePublished')
    table.string('timeRecevied')
    table.string('transactionId')
    table.string('publisherAppName')
    table.string('publisherEventName')
    table.string('org')
    table.string('stack')
  })
  log.trace({ createTable }, 'migration up')
  return createTable
}

exports.down = function(knex, Promise) {
  const dropTable = knex.schema.dropTable('users')
  debug(dropTable.toString())
  return dropTable
}
