'use strict'
const joi = require('joi')

const log = require('logger').child({ migration: 'create_events_table' })
const KnexTableFromJoi = require('./knex-table-from-joi')

const METRIC_EVENT_SCHEMA = joi.object({
  eventName: joi.string().required(),
  appName: joi.string().required(),
  timePublished: joi.string().required(),
  timeRecevied: joi.string().required(),
  transactionId: joi.string().required().description('ID used to join events together'),
  previousEventName: joi.string(),
  // tags
  githubOrgId: joi.string(),
  githubUserId: joi.string(),
  bigPoppaOrgId: joi.string(),
  dockerHostIp: joi.string(),
  masterInstanceId: joi.string(),
  repoName: joi.string(),
  branchName: joi.string()
}).required()

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
