import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Experiences extends BaseSchema {
  protected tableName = 'experiences'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_doctor').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('title').notNullable()
      table.string('lieu').notNullable()

      table.timestamp('date_debut', { useTz: true }).notNullable()
      table.timestamp('date_fin', { useTz: true }).notNullable()

      table.text('description').nullable()
      table.string('poste').notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
 