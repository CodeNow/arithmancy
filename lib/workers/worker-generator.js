module.exports = (WorkerClass, jobSchema) => {
  return {
    _Worker: WorkerClass,

    task: (job, meta) => {
      const worker = new WorkerClass(job, meta)
      return worker.task()
    },

    parseTags: (job) => {
      return WorkerClass.parseTags(job)
    },

    jobSchema: jobSchema
  }
}
