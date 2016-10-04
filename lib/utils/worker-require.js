'use strict'

/**
 * @param  {String}  workerName
 * @return {Boolean}
 */
function _isLifeCycleWorker (workerName) {
  return ~workerName.indexOf('container.life-cycle')
}

module.exports = (workerName) => {
  if (_isLifeCycleWorker(workerName)) {
    return require('workers/container.life-cycle')
  } else {
    return require('workers/' + workerName)
  }
}

