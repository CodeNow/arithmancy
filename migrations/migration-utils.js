'use strict'
const stringcase = require('stringcase')

module.exports = class MigrationUtils {
  static configureTableFromJoi (table, joi) {
    joi._inner.children.forEach((joiItem) => {
      const columnName = stringcase.snakecase(joiItem.key)
      const sqlType = MigrationUtils._tableTypeFromJoi(joiItem)
      const nullType = MigrationUtils._getNullableType(joiItem)

      table[sqlType](columnName)[nullType]()
    })
  }

  static _tableTypeFromJoi (joiItem) {
    const joiType = joiItem.schema._type
    if (joiType === 'string') {
      return 'string'
    }

    throw new Error(`joi type ${joiType} is not supported`)
  }

  static _getNullableType (joiItem) {
    if (joiItem.schema._flags.presence === 'required') {
      return 'notNullable'
    }

    return 'nullable'
  }
}
