import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddProfileFieldsToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('genre').nullable()
      table.string('weight').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('genre')
      table.dropColumn('weight')
    })
  }
}
