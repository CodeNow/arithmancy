'use strict'
require('loadenv')()
const PonosServer = require('ponos').Server

const logger = require('../logger')
const subscribedEventList = require('./subscribed-event-list.js')
const taskList = require('./task-list.js')

/**
 * The ponos server.
 * @type {ponos~WorkerServer}
 * @module worker-server
 */
class WorkerServer extends PonosServer {
  constructor () {
    super({
      name: process.env.APP_NAME,
      log: logger.child({ module: 'worker/server' }),
      rabbitmq: {
        channel: {
          prefetch: process.env.WORKER_PREFETCH
        },
        hostname: process.env.RABBITMQ_HOSTNAME,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
      },
      tasks: WorkerServer._getTasksObject(),
      events: WorkerServer._getEventsObject()
    })
  }

  /**
   * @return {Object}
   */
  static _getTasksObject () {
    return WorkerServer._requireWorkers(taskList)
  }

  /**
   * @return {Object}
   */
  static _getEventsObject () {
    return WorkerServer._requireWorkers(subscribedEventList)
  }

  /**
   * @param {String[]} workerNames
   * @return {Object}
   */
  static _requireWorkers (workerNames) {
    return workerNames.reduce((outObject, workerName) => {
      outObject[workerName] = require('../workers/' + workerName)

      return outObject
    }, {})
  }
}

module.exports = new WorkerServer()
