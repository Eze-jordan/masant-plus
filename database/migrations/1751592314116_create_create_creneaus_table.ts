import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCreneauxTable extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('idDisponibilite').notNullable()
        .references('id').inTable('disponibilites').onDelete('CASCADE')
      table.string('heureDebut').notNullable()
      table.string('heureFin').notNullable()
      table.boolean('disponible').notNullable()
      table.timestamp('createdAt', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updatedAt', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
