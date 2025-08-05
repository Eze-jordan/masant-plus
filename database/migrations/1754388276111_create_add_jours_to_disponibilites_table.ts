import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddJoursToDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('jours').nullable().comment('Jours de la semaine sélectionnés (ex: ["lundi","mercredi"])')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('jours')
    })
  }
}
