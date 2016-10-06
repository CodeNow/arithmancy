'use strict'
const Lab = require('lab')
const Code = require('code')

const OrganizationCreated = require('workers/organization.created')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.created', () => {
  const job = {
    organization: {
      id: 123,
      githubId: 88888
    },
    creator: {
      githubId: 999999
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'big-poppa',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = OrganizationCreated.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.creator.githubId
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = OrganizationCreated.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.organization.githubId,
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.creator.githubId
    })
    const worker = new OrganizationCreated._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})
