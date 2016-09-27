'use strict'
const joi = require('joi')

module.exports = [{
  name: 'task.created',
  jobSchema: joi.object({
    id: joi.string()
  })
}]
