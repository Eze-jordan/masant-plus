import { BaseSchema } from "@adonisjs/lucid/schema"

export default class LiveUsers extends BaseSchema {
  protected tableName = 'live_users'

  public async up () {
    // Utilisation de this.schema.createTable au lieu de this.createTable
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('live_id').notNullable().references('id').inTable('lives').onDelete('CASCADE') // Référence à Live
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE') // Référence à User
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // Ajoute created_at
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now()) // Ajoute updated_at
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName) // Utilisation de this.schema.dropTable pour la suppression
  }
}
