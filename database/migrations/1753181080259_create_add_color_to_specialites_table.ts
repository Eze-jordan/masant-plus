import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddColorToSpecialites extends BaseSchema {
  protected tableName = 'specialites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('color', 20).nullable()  // colonne color de type string, nullable
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('color')
    })
  }
}
