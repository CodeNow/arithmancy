'use strict'
const RabbitConnector = require('ponos/lib/rabbitmq')

const logger = require('logger.js')
const publishedEventList = require('external/published-event-list.js')
const taskList = require('external/task-list.js')

/**
 * Module in charge of rabbitmq connection and job publishing
 */
class Publisher {
  /**
   * @returns {Promise}
   * @resolves undefined when connected
   * @rejects Error if connection failed
   */
  start () {
    this._publisher = new RabbitConnector({
      name: process.env.APP_NAME,
      log: logger.child({ module: 'publisher' }),
      hostname: process.env.RABBITMQ_HOSTNAME,
      port: process.env.RABBITMQ_PORT,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      tasks: Publisher._getTaskDefinitions(),
      events: publishedEventList
    })

    return this._publisher.connect()
  }

  /**
   * @param  {Object} jobData
   * @return {Promise}
   */
  publishEvent (queueName, jobData) {
    return this._publisher.publishEvent(queueName, jobData)
  }

  /**
   * @param  {Object} jobData
   * @return {Promise}
   */
  publishTask (queueName, jobData) {
    return this._publisher.publishTask(queueName, jobData)
  }

  /**
   * @return {Object}
   */
  static _getTaskDefinitions () {
    return taskList.map((taskName) => {
      return {
        name: taskName,
        jobSchema: require('../workers/' + taskName).jobSchema
      }
    })
  }
}

module.exports = new Publisher()
module.exports._Publisher = Publisher
