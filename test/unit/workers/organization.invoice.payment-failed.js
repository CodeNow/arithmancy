'use strict'
const Lab = require('lab')
const Code = require('code')

const OrganizationPaymentFailed = require('workers/organization.invoice.payment-failed')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.invoice.payment-failed', () => {
  const job = {
    organization: {
      id: 123
    },
    paymentMethodOwner: {
      githubId: 999999
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'cream',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = OrganizationPaymentFailed.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.paymentMethodOwner.githubId
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = OrganizationPaymentFailed.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id,
      githubUserId: job.paymentMethodOwner.githubId
    })
    const worker = new OrganizationPaymentFailed._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})
