'use strict'
const log = require('logger').child({ migration: 'create_events_table' })
const KnexTableFromJoi = require('./knex-table-from-joi')
const METRIC_EVENT_SCHEMA = require('models/data-structures/metric-event')._METRIC_EVENT_SCHEMA

exports.up = (knex, Promise) => {
  const createTable = knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    const converter = new KnexTableFromJoi(table, METRIC_EVENT_SCHEMA)
    converter.configureTableFromJoi()
  })
  log.debug({ createTable }, 'migration up')
  return createTable
}

exports.down = (knex, Promise) => {
  const dropTable = knex.schema.dropTable('events')
  log.debug(dropTable.toString())
  return dropTable
}
