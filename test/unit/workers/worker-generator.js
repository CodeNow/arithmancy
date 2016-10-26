'use strict'
const Code = require('code')
const Lab = require('lab')

const workerGenerator = require('workers/worker-generator')

require('sinon-as-promised')(require('bluebird'))
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('worker-generator', () => {
  it('should be properly initialized', (done) => {
    expect(workerGenerator.bind(null, 'aaa')).to.throw(Error, 'Programming error. Schema was not defined for aaa')
    done()
  })
})
