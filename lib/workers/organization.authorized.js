'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.authorized'
  }

  static parseTags (job) {
    return {
      githubOrgId: job.githubId,
      githubUserId: job.creator.githubId
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.organizationAuthorized)
