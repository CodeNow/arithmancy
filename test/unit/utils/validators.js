'use strict'
const joi = require('joi')
const Lab = require('lab')
const Promise = require('bluebird')

const v = require('utils/validators')

require('sinon-as-promised')(Promise)
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it

describe('validators unit test', () => {
  it('should require string', (done) => {
    joi.assert('Accio', v.requiredString())
    done()
  })

  it('should require number', (done) => {
    joi.assert(123, v.requiredNumber())
    done()
  })

  it('should require timestamp', (done) => {
    joi.assert(new Date(), v.requiredTimestamp())
    done()
  })
}) // end validators unit test
