import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateDiscussionAndMessages extends BaseSchema {
  public async up() {
    this.schema.createTable('discussions', (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('id_doctor').notNullable()
      table.uuid('id_patient').notNullable()
      table.timestamp('date_chat', { useTz: true }).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })

    this.schema.createTable('messages', (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('id_discussion').notNullable()
      table.uuid('id_user_sender').notNullable()
      table.text('message').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      table
        .foreign('id_discussion')
        .references('id')
        .inTable('discussions')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable('messages')
    this.schema.dropTable('discussions')
  }
}
