import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateDiscussionMessageries extends BaseSchema {
  public async up() {
    this.schema.createTable('discussion_messageries', (table) => {
      table.increments('id').primary()
      table.integer('id_discussion').unsigned().notNullable()
      table.integer('id_user_sender').unsigned().notNullable()
      table.text('message').notNullable()
      table.string('type_message').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      table
        .foreign('id_discussion')
        .references('id')
        .inTable('discussions')
        .onDelete('CASCADE')

      table
        .foreign('id_user_sender')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable('discussion_messageries')
  }
}
