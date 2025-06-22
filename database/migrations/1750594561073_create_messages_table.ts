import { BaseSchema } from "@adonisjs/lucid/schema"

export default class CreateDiscussionAndMessages extends BaseSchema {
  public async up() {
    // 1. Créer la table discussions
    this.schema.createTable('discussions', (table) => {
      table.increments('id').primary()
      table.integer('id_doctor').notNullable()
      table.integer('id_patient').notNullable()
      table.timestamp('date_chat').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())
    })

    // 2. Créer la table messages
    this.schema.createTable('messages', (table) => {
      table.increments('id').primary()
      table.integer('id_discussion').unsigned().notNullable()
      table.integer('id_user_sender').notNullable()
      table.text('message').notNullable()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      // FK vers discussions (doit être créée après la table discussions)
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
