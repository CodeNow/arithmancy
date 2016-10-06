'use strict'
const Code = require('code')
const Lab = require('lab')

const Worker = require('workers/user.whitelisted')

require('sinon-as-promised')(require('bluebird'))
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('container.life-cycle', () => {
  const testJob = {
    githubId: 1738
  }

  describe('static methods', () => {
    it('should parse tags', (done) => {
      const result = Worker._Worker.parseTags(testJob)
      expect(result).to.equal({
        githubOrgId: testJob.githubId
      })
      done()
    })
  }) // end static methods

  describe('instance methods', () => {
    let worker
    beforeEach((done) => {
      worker = new Worker._Worker(testJob)
      done()
    })

    afterEach((done) => {
      done()
    })

    describe('_parseTags', () => {
      it('should parse tags', (done) => {
        const result = worker._parseTags()
        expect(result).to.equal({
          githubOrgId: testJob.githubId
        })
        done()
      })
    }) // end _parseTags
  }) // end instance methods
})
