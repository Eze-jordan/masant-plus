import { BaseSchema } from "@adonisjs/lucid/schema"

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid('id_user_receiver').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id_user_receiver')
    })
  }
}
