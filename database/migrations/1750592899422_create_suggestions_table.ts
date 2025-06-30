import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatutSuggestion } from '../../app/enum/enums.js'

export default class Suggestions extends BaseSchema {
  protected tableName = 'suggestions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Clé étrangère UUID vers users
      table.uuid('idUser').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('titre').notNullable()
      table.text('description').nullable()

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
