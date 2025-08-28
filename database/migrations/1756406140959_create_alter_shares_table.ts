import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RecreateSharesTable extends BaseSchema {
  protected tableName = 'shares'

  async up() {
    // Supprimer la table existante
    this.schema.dropTableIfExists(this.tableName)

    // Activer l'extension uuid-ossp
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    // Créer la nouvelle table avec la structure correcte
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('doctor_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('patient_id').references('id').inTable('users').onDelete('CASCADE')
      table.text('link').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['doctor_id'])
      table.index(['patient_id'])
      table.unique(['doctor_id', 'patient_id', 'link'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
