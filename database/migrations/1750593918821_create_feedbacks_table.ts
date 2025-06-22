import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Feedbacks extends BaseSchema {
  protected tableName = 'feedbacks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_user').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('sujet').nullable()
      table.text('message').notNullable()
      table.integer('note').notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
