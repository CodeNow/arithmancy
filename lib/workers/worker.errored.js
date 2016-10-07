'use strict'
require('loadenv')()
const keypather = require('keypather')()

const jobParser = require('utils/job-parser')
const MetricTracker = require('models/metric-tracker')
const schemas = require('workers/schemas')
const subscribedEvents = require('external/subscribed-event-list')

class Worker {
  constructor (job, meta) {
    this.job = job
    this.meta = meta
  }

  /**
   * @resolves {Undefined}
   * @returns {Promise}
   */
  task () {
    const eventName = this.job.originalWorkerName
    const mainData = {
      eventName: eventName,
      appName: this.meta.appId,
      timePublished: new Date(this.meta.timestamp),
      timeRecevied: new Date(),
      transactionId: this.job.tid,
      previousEventName: keypather.get(this, 'job.originalJobMeta.headers.publisherWorkerName')
    }
    const tags = subscribedEvents.indexOf(this.job.originalWorkerName) > -1
      ? jobParser.parseWorkerJob(eventName, this.job.originalJobPayload) : {}
    return MetricTracker.track(Object.assign({}, mainData, tags, { isWorkerSuccessfull: false }))
  }
}

module.exports = {
  _Worker: Worker,

  task: (job, meta) => {
    const worker = new Worker(job, meta)
    return worker.task()
  },

  jobSchema: schemas.workerErroed
}
