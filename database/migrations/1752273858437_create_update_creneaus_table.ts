import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateCreneauxTable extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    // Supprimer la table si elle existe (attention à perte de données)
    await this.schema.dropTableIfExists(this.tableName)

    // Recréer la table
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('id_disponibilite').notNullable()
        .references('id').inTable('disponibilites')
        .onDelete('CASCADE')

      table.string('heure_debut', 5).notNullable()  // format HH:mm
      table.string('heure_fin', 5).notNullable()    // format HH:mm

      table.boolean('disponible').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
