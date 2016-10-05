'use strict'
const Lab = require('lab')
const Code = require('code')

const DockLost = require('workers/dock.lost')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('dock.lost', () => {
  const job = {
    githubOrgId: 123,
    tx: 'job-tid'
  }
  const meta = {
    appId: 'palantiri',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = DockLost.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.githubOrgId
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = DockLost.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.githubOrgId
    })
    const worker = new DockLost._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })

  it('should return correct eventName', (done) => {
    const worker = new DockLost._Worker(job, meta)
    const eventName = worker._getEventName()
    expect(eventName).to.equal('dock.lost')
    done()
  })
})
