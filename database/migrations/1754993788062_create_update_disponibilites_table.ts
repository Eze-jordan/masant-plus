import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateDisponibilitesTable extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('id_doctor').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.dateTime('date_debut').nullable()
      table.dateTime('date_fin').nullable()

      table.boolean('actif').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
