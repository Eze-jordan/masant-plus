import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatutSuggestion } from '../../app/enum/enums.js'

export default class Suggestions extends BaseSchema {
  protected tableName = 'suggestions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Clé étrangère vers users
      table.integer('idUser').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('titre').notNullable()
      table.text('description').nullable()

      // Enum pour le statut
      table.enum('statut', Object.values(StatutSuggestion), {
        useNative: true,
        enumName: 'statut_suggestion_enum',
      }).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
