'use strict'
require('loadenv')()

const BaseMetricWorker = require('workers/base.metric.worker')
const schema = require('workers/schemas')
const workerGenerator = require('workers/worker-generator')
const jobParser = require('utils/job-parser')

class Worker extends BaseMetricWorker {
  _getEventName () {
    return 'organization.payment-method.removed'
  }

  static parseTags (job) {
    return jobParser.parseOrganizationPaymentMethod(job)
  }

  _parseTags () {
    return Worker.parseTags(this.job)
  }
}

module.exports = workerGenerator(Worker, schema.orgPaymentMethodAddedRemoved)
