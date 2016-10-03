'use strict'
const Lab = require('lab')
const Code = require('code')

const MetricTracker = require('models/metric-tracker')
const ContainerNetworkAttached = require('workers/container.network.attached')

const sinon = require('sinon')
const lab = exports.lab = Lab.script()

const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('container.network.attached', () => {
  const job = {
    id: 'container-id-1',
    inspectData: {
      Config: {
        Labels: {
          githubOrgId: 123123,
          instanceId: 'some-instance-id'
        }
      }
    },
    tx: 'job-tid'
  }
  const meta = {
    appId: 'sauron',
    timestamp: Date.now()
  }
  it('should parse tags correctly', (done) => {
    const tags = ContainerNetworkAttached.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.inspectData.Config.Labels.githubOrgId,
      instanceId: job.inspectData.Config.Labels.instanceId,
      containerId: job.id
    })
    done()
  })

  it('should static parseTags return same result as non static', (done) => {
    const tags = ContainerNetworkAttached.parseTags(job)
    expect(tags).to.equal({
      githubOrgId: job.inspectData.Config.Labels.githubOrgId,
      instanceId: job.inspectData.Config.Labels.instanceId,
      containerId: job.id
    })
    const worker = new ContainerNetworkAttached._Worker(job, meta)
    const parsedTags = worker._parseTags()
    expect(tags).to.equal(parsedTags)
    done()
  })
})
