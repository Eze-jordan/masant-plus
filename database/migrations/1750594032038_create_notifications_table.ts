import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('id_user').notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('titre').notNullable()
      table.text('description').notNullable()
      table.boolean('is_read').defaultTo(false)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
