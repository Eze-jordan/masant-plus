import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('id_doctor').notNullable()
      table.datetime('date_debut').nullable()
      table.datetime('date_fin').nullable()
      table.string('heure_debut').notNullable()
      table.string('heure_fin').notNullable()
      table.boolean('actif').notNullable()
      table.timestamps(true, true)

      // You can add foreign key constraints if needed
      table.foreign('id_doctor').references('users.id').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
