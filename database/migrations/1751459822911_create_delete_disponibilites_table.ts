import { BaseSchema } from "@adonisjs/lucid/schema"

export default class DeleteDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up () {
    this.schema.dropTable(this.tableName)
  }

  public async down () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('id_doctor').notNullable()
      table.datetime('date_debut').nullable()
      table.datetime('date_fin').nullable()
      table.string('heure_debut').notNullable()
      table.string('heure_fin').notNullable()
      table.boolean('actif').notNullable()
      table.timestamps(true, true)
    })
  }
}
