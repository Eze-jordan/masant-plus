import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddIsUsedColumnToCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_used').defaultTo(false).notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_used')
    })
  }
}
