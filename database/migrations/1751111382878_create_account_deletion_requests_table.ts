import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AccountDeletionRequests extends BaseSchema {
  protected tableName = 'account_deletion_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // UUID primary key avec génération automatique
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // user_id en UUID, FK vers users.id (en UUID aussi)
      table.uuid('user_id').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.text('reason').nullable()
      table.boolean('processed').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
