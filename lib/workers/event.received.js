'use strict'
const joi = require('joi')
const monitorDog = require('monitor-dog')
const Promise = require('bluebird')

const logger = require('../logger.js')
const publisher = require('../external/publisher.js')

class Worker {
  constructor (job) {
    this.job = job
    this.log = logger.child({ job, queue: 'event.received' })
  }

  run () {
    return Promise.try(this._sendMetricData).bind(this)
      .then(this._publishEvent)
  }

  _sendMetricData () {
    this.log.trace('_sendMetricData')
    monitorDog.inc('event.received')
  }

  _publishEvent () {
    this.log.trace('_publishEvent')
    publisher.publishEvent('event.received', {
      id: '1234'
    })
  }
}

module.exports = {
  _Worker: Worker,

  jobSchema: joi.object({
    testString: joi.string().required()
  }).unknown().required().label('event.received job data'),

  task: (job) => {
    return new Worker(job).run()
  }
}
