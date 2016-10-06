'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')
const jobParser = require('utils/job-parser')

class Worker extends BaseMetricWorker {
  static parseTags (job) {
    return jobParser.parseDockEvent(job)
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.dockEvent)