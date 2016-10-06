'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  static parseTags (job) {
    return {
      githubOrgId: job.githubOrgId,
      dockerHostIp: job.ipAddress
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.apiDockEvent)
