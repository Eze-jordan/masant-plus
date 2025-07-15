// database/migrations/XXXXXXXXXXXX_create_demande_docteurs_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateDemandeDocteursTable extends BaseSchema {
  protected tableName = 'demande_docteurs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('phone').nullable()
      table.string('license_number').nullable()
      table.string('specialisation').nullable()
      table.enum('status', ['pending', 'approved', 'rejected']).defaultTo('pending')

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}