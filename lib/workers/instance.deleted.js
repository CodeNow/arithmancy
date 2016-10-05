'use strict'
require('loadenv')()
const schema = require('workers/schemas')

const BaseMetricWorker = require('workers/base.metric.worker')
const jobParser = require('utils/job-parser')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'instance.deleted'
  }

  static parseTags (job) {
    return jobParser.getInstanceTags(job.instance)
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.instanceEvents)
