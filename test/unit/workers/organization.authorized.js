'use strict'
const Lab = require('lab')
const Code = require('code')

const Worker = require('workers/organization.authorized')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.authorized', () => {
  let testJob
  const testGithubOrgId = 1738
  const testGithubUserId = 9999
  beforeEach((done) => {
    testJob = {
      githubId: testGithubOrgId,
      creator: {
        githubId: testGithubUserId
      }
    }
    done()
  })

  describe('static methods', () => {
    it('should parse tags correctly', (done) => {
      const result = Worker.parseTags(testJob)
      expect(result).to.equal({
        githubOrgId: testGithubOrgId,
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
        githubOrgId: testGithubOrgId,
        githubUserId: testGithubUserId
      })
      done()
    })
  }) // end instance methods
})
