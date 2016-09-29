'use strict'
const log = require('logger').child({ migration: 'create_events_table' })

exports.up = (knex, Promise) => {
  const createTable = knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    table.string('event_name')
    table.string('time_published')
    table.string('time_recevied')
    table.string('transaction_id')
    table.string('publisher_app_name')
    table.string('previous_event_name')
    table.string('org')
    table.string('stack')
  })
  log.debug({ createTable }, 'migration up')
  return createTable
}

exports.down = (knex, Promise) => {
  const dropTable = knex.schema.dropTable('events')
  log.debug(dropTable.toString())
  return dropTable
}
