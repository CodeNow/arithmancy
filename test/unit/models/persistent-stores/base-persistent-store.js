'use strict'
const Code = require('code')
const Lab = require('lab')

const NotImplemented = require('errors/not-implemented')
const BasePersistentStore = require('models/persistent-stores/base-persistent-store')

const lab = exports.lab = Lab.script()

const beforeEach = lab.beforeEach
const describe = lab.describe
const expect = Code.expect
const it = lab.it

describe('persistent-store unit test', () => {
  describe('methods', () => {
    let persistentStore

    beforeEach((done) => {
      persistentStore = new BasePersistentStore()
      done()
    })

    describe('connect', () => {
      it('should throw it not implemented', (done) => {
        expect(() => {
          persistentStore.initialize()
        }).to.throw(NotImplemented, /Not Implemented/)

        done()
      })
    }) // end connect

    describe('save', () => {
      it('should throw if not implemented', (done) => {
        expect(() => {
          persistentStore.save()
        }).to.throw(NotImplemented, /Not Implemented/)

        done()
      })
    }) // end save
  }) // end methods
}) // persistent-store unit test
