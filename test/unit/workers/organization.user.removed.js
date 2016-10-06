'use strict'
const Lab = require('lab')
const Code = require('code')

const OrganizationUserRemoved = require('workers/organization.user.removed')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.user.removed', () => {
  const job = {
    organization: {
      id: 123,
      githubId: 88888
    },
    user: {
      id: 234,
      githubId: 999999
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'big-poppa',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = OrganizationUserRemoved.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = OrganizationUserRemoved.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.user.githubId,
      bigPoppaUserId: job.user.id
    })
    const worker = new OrganizationUserRemoved._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})
