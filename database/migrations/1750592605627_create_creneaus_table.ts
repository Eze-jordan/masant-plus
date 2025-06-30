import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Creneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // UUID comme clé primaire avec génération automatique
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      // Clé étrangère UUID vers disponibilites
      table.uuid('idDisponibilite').notNullable()
        .references('id').inTable('disponibilites')
        .onDelete('CASCADE')

      table.string('heureDebut').notNullable()
      table.string('heureFin').notNullable()
      table.boolean('disponible').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
