'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.payment-method.added'
  }

  static parseTags (job) {
    return {
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.paymentMethodOwner.githubId
    }
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.orgPaymentMethodAddedRemoved)
