'use strict'
const Promise = require('bluebird')

const MetricEvent = require('models/data-structures/metric-event')
const datadogForwarder = require('models/forwarders/datadog-forwarder')
const postgresStore = require('models/persistent-stores/postgres-store')

module.exports = class MetricTracker {
  static track (metricData) {
    const metricEvent = new MetricEvent(metricData)

    return Promise.all([
      datadogForwarder.sendMetricEvent(metricEvent),
      postgresStore.saveMetricEvent(metricEvent)
    ])
  }
}
