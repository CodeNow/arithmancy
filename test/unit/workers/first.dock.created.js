'use strict'
const Lab = require('lab')
const Code = require('code')

const Worker = require('workers/first.dock.created')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('first.dock.created', () => {
  let testJob

  beforeEach((done) => {
    testJob = {
      githubId: 123,
      dockerHostIp: '10.2.3.4'
    }
    done()
  })

  describe('static methods', () => {
    it('should parse tags correctly', (done) => {
      const result = Worker.parseTags(testJob)
      expect(result).to.equal({
        githubOrgId: testJob.githubId,
        dockerHostIp: testJob.dockerHostIp
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
        githubOrgId: testJob.githubId,
        dockerHostIp: testJob.dockerHostIp
      })
      done()
    })

    it('should return correct eventName', (done) => {
      const eventName = worker._getEventName()
      expect(eventName).to.equal('first.dock.created')
      done()
    })
  }) // end instance methods
})
