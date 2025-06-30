import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Likes extends BaseSchema {
  protected tableName = 'likes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('id_user').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.uuid('id_doctor').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.timestamp('date', { useTz: true }).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
