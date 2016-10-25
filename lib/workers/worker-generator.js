'use strict'

const schemas = require('workers/schemas')
const BaseMetricWorker = require('workers/base.metric.worker')

module.exports = (workerName) => {
  const jobSchema = schemas.getWorkerSchema(workerName)
  if (!jobSchema) {
    throw new Error(`Programming error. Schema was not defined for #{workerName}`)
  }
  return {
    task: (job, meta) => {
      const worker = new BaseMetricWorker(job, meta)
      return worker.task()
    },

    jobSchema: jobSchema
  }
}
