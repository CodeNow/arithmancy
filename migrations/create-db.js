'use strict'
require('loadenv')()
const knex = require('knex')

knex({
  client: 'pg',
  connection: process.env.ROOT_POSTGRES_CONNECTION
})
.raw('CREATE DATABASE arithmancy;')
.catch((error) => {
  console.log('ERROR', error)
})
.finally(process.exit)
