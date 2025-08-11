import { BaseSchema } from "@adonisjs/lucid/schema"

export default class RemoveJoursFromDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('jours')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.json('jours').nullable()
    })
  }
}
