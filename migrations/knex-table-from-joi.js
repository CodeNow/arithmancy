'use strict'
const stringcase = require('stringcase')

module.exports = class KnexTableFromJoi {
  constructor (knexTable, joiSchema) {
    this.knexTable = knexTable
    this.joiSchema = joiSchema
  }

  configureTableFromJoi () {
    this.joiSchema._inner.children.forEach((joiItem) => {
      const columnName = stringcase.snakecase(joiItem.key)
      const sqlType = this._tableTypeFromJoi(joiItem)
      const nullType = this._getNullableType(joiItem)

      this.knexTable[sqlType](columnName)[nullType]()
    })
  }

  _tableTypeFromJoi (joiItem) {
    const joiType = joiItem.schema._type
    if (joiType === 'string') {
      return 'string'
    } else if (joiType === 'number') {
      return 'integer'
    } else if (joiType === 'date') {
      return 'timestamp'
    }

    throw new Error(`joi type ${joiType} is not supported`)
  }

  _getNullableType (joiItem) {
    if (joiItem.schema._flags.presence === 'required') {
      return 'notNullable'
    }

    return 'nullable'
  }
}
