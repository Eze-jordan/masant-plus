import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ServiceDoctors extends BaseSchema {
  protected tableName = 'service_doctors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('id_service').notNullable()
        .references('id').inTable('services')
        .onDelete('CASCADE')

      table.uuid('id_doctor').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
