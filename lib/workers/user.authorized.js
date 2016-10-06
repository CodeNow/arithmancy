'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'user.authorized'
  }

  static parseTags (job) {
    return {
      githubUserId: job.githubId
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.organizationAuthorized)
