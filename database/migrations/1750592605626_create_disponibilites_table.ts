import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Disponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Clé étrangère vers users (doctors)
      table.integer('idDoctor').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')

      table.string('jour').notNullable()
      table.string('heureDebut').notNullable()
      table.string('heureFin').notNullable()
      table.boolean('actif').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
