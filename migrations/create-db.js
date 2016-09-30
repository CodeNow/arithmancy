'use strict'
const knex = require('knex')

knex({
  client: 'pg',
  connection: 'postgres://postgres@localhost/postgres',
  pool: {
    min: process.env.POSTGRES_POOL_MIN,
    max: process.env.POSTGRES_POOL_MAX
  }
})
.raw('CREATE DATABASE arithmancy;')
.catch((error) => {
  console.log('ERROR', error)
})
.finally(process.exit)
