import { BaseSchema } from "@adonisjs/lucid/schema"

export default class PasswordResets extends BaseSchema {
  protected tableName = 'password_resets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      // Utiliser UUID pour la clé primaire
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // user_id en UUID, FK vers users.id (UUID aussi)b
      table.uuid('user_id').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('email').notNullable()
      table.string('code').notNullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      
      table.index(['email', 'code'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
