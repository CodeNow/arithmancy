'use strict'
const joi = require('joi')
const monitorDog = require('monitor-dog')
const Promise = require('bluebird')

const logger = require('../logger.js')
const publisher = require('../external/publisher.js')

class Worker {
  constructor (job) {
    this.job = job
    this.log = logger.child({ job, queue: 'task.create' })
  }

  run () {
    return Promise.try(this._sendMetricData).bind(this)
      .then(this._publishEvent)
  }

  _sendMetricData () {
    this.log.trace('_sendMetricData')
    monitorDog.inc('task.create')
  }

  _publishEvent () {
    this.log.trace('_publishEvent')
    publisher.publishEvent('task.created', {
      id: '1234'
    })
  }
}

module.exports = {
  _Worker: Worker,

  jobSchema: joi.object({
    testString: joi.string().required()
  }).unknown().required().label('task.create job data'),

  task: (job) => {
    return new Worker(job).run()
  }
}
