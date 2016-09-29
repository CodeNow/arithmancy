'use strict'
const log = require('logger').child({ migration: 'create_events_table' })
const metricEvent = require('models/data-structures/metric-event')
const MigrationUtils = require('./migration-utils')

exports.up = (knex, Promise) => {
  const createTable = knex.schema.createTable('events', (table) => {
    table.increments('id').primary()
    MigrationUtils.configureTableFromJoi(table, metricEvent._METRIC_EVENT_SCHEMA)
  })
  log.debug({ createTable }, 'migration up')
  return createTable
}

exports.down = (knex, Promise) => {
  const dropTable = knex.schema.dropTable('events')
  log.debug(dropTable.toString())
  return dropTable
}
