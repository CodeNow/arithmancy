'use strict'
const Lab = require('lab')
const Code = require('code')

const DockRemoved = require('workers/dock.removed')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('dock.removed', () => {
  const testOrgId = 1738
  const testDockerIp = '10.0.0.2'
  const testJob = {
    githubOrgId: testOrgId,
    host: `http://${testDockerIp}:4342`
  }
  const meta = {
    appId: 'palantiri',
    timestamp: Date.now()
  }

  it('should parse tags correctly', (done) => {
    const tags = DockRemoved.parseTags(testJob)
    expect(tags).to.equal({
      githubOrgId: testOrgId,
      dockerHostIp: testDockerIp
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = DockRemoved.parseTags(testJob)
    expect(tags).to.equal({
      githubOrgId: testOrgId,
      dockerHostIp: testDockerIp
    })
    const worker = new DockRemoved._Worker(testJob, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})