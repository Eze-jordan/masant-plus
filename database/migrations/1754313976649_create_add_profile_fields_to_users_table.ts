import { BaseSchema } from "@adonisjs/lucid/schema"

export default class Ressources extends BaseSchema {
  protected tableName = 'ressources'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('url').notNullable()
      table.string('titre').notNullable()
      table.string('date').notNullable() // format texte: '07/05/2000'
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
