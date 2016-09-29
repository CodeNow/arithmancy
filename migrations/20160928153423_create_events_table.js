'use strict'
const log = require('logger').child({ migration: 'create_events_table' })

exports.up = (knex, Promise) => {
  const createTable = knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    table.string('event_name').notNullable()
    table.string('time_published').notNullable()
    table.string('time_recevied').notNullable()
    table.string('transaction_id').notNullable()
    // optional
    table.string('publisher_app_name').nullable()
    table.string('previous_event_name').nullable()
    // tags
    table.string('org').nullable()
    table.string('stack').nullable()
    table.string('host').nullable()
    table.string('template').nullable()
    table.string('branch').nullable()
  })
  log.debug({ createTable }, 'migration up')
  return createTable
}

exports.down = (knex, Promise) => {
  const dropTable = knex.schema.dropTable('events')
  log.debug(dropTable.toString())
  return dropTable
}
