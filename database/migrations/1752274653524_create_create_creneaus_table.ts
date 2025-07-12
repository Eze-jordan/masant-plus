// database/migrations/xxxx_create_creneaux.ts

import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('heure_debut', 5).notNullable()
      table.string('heure_fin', 5).notNullable()
      table.boolean('disponible').defaultTo(true).notNullable()
      
      table.uuid('id_disponibilite')
        .notNullable()
        .references('id')
        .inTable('disponibilites')
        .onDelete('CASCADE')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
