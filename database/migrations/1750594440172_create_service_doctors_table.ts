import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ServiceDoctors extends BaseSchema {
  protected tableName = 'service_doctors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_service').unsigned().references('id').inTable('services').onDelete('CASCADE')
      table.integer('id_doctor').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
