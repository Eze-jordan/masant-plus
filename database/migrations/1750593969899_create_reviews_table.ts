import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Reviews extends BaseSchema {
  protected tableName = 'reviews'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_appointment').unsigned().notNullable()
        .references('id').inTable('appointments')
        .onDelete('CASCADE')

      table.integer('note_sur_5').notNullable()
      table.text('commentaire').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
