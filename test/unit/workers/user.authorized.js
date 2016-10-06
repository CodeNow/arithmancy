'use strict'
const Lab = require('lab')
const Code = require('code')

const Worker = require('workers/user.authorized')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('user.authorized', () => {
  let testJob
  const testGithubUserId = 1738

  beforeEach((done) => {
    testJob = {
      githubId: testGithubUserId
    }
    done()
  })

  describe('static methods', () => {
    it('should parse tags correctly', (done) => {
      const result = Worker.parseTags(testJob)
      expect(result).to.equal({
        githubUserId: testGithubUserId
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

    it('should static parseTags return same result as non static', (done) => {
      const result = worker._parseTags()
      expect(result).to.equal({
        githubUserId: testGithubUserId
      })
      done()
    })

    it('should return correct eventName', (done) => {
      const eventName = worker._getEventName()
      expect(eventName).to.equal('user.authorized')
      done()
    })
  }) // end instance methods
})
