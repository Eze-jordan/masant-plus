import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Prescriptions extends BaseSchema {
  protected tableName = 'prescriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('id_appointment').notNullable()
        .references('id').inTable('appointments')
        .onDelete('CASCADE')

      table.string('label').nullable()
      table.string('duration').nullable()
      table.string('dosage').nullable()
      table.string('medications').nullable()
      table.string('instructions').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
