'use strict'
require('loadenv')()
const bunyan = require('bunyan')
const cls = require('continuation-local-storage')
const put = require('101/put')

const serializers = put(bunyan.stdSerializers, {
  tx: () => {
    let tid
    try {
      tid = cls.getNamespace('ponos').get('tid')
    } catch (e) {
      // cant do anything here
    }
    return tid && { tid }
  }
})

/**
 * @return {object} Logger
 */
const logger = module.exports = bunyan.createLogger({
  name: process.env.APP_NAME,
  streams: [{
    level: process.env.LOG_LEVEL,
    stream: process.stdout
  }],
  serializers: serializers,
  // disable to increase perf if required
  src: true,
  commit: process.env.npm_package_gitHead,
  environment: process.env.NODE_ENV
})

/**
 * Initiate and return child instance.
 * @returns {object} Logger
 */
module.exports = logger.child({ tx: true })
