'use strict'
const Lab = require('lab')
const Code = require('code')

const OrganizationTrialEnded = require('workers/organization.trial.ended')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.trial.ended', () => {
  const job = {
    organization: {
      id: 123
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'cream',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = OrganizationTrialEnded.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = OrganizationTrialEnded.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id
    })
    const worker = new OrganizationTrialEnded._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})