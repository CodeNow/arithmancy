'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.user.removed'
  }

  static parseTags (job) {
    return {
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.orgUserAddedRemoved)
