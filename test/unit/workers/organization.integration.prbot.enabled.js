'use strict'
const Lab = require('lab')
const Code = require('code')

const PrBotEnabled = require('workers/organization.integration.prbot.enabled')

const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('organization.integration.prbot.enabled', () => {
  const job = {
    organization: {
      id: 1233
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = PrBotEnabled.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = PrBotEnabled.parseTags(job)
    expect(tags).to.equal({
      bigPoppaOrgId: job.organization.id
    })
    const worker = new PrBotEnabled._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})
