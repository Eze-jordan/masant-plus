import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shares'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('doctor_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('patient_id').references('id').inTable('users').onDelete('CASCADE')
      table.text('link').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Index pour améliorer les performances
      table.index(['doctor_id'])
      table.index(['patient_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
