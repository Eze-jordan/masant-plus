import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AlterDisponibilitesMakeHoursNullable extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('heure_debut').nullable().alter()
      table.string('heure_fin').nullable().alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('heure_debut').notNullable().alter()
      table.string('heure_fin').notNullable().alter()
    })
  }
}
