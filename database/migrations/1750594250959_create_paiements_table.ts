import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatusPaiement } from '../../app/enum/enums.js' // ajuste le chemin si nécessaire

export default class Paiements extends BaseSchema {
  protected tableName = 'paiements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.uuid('id_user').references('id').inTable('users').onDelete('CASCADE').notNullable()
      table.uuid('id_appointment').references('id').inTable('appointments').onDelete('CASCADE').notNullable()

      table.decimal('montant', 10, 2).notNullable()

      table.enum('statut', Object.values(StatusPaiement)).notNullable()

      table.timestamp('date_paiement', { useTz: true }).notNullable()

      table.uuid('mode_id').references('id').inTable('mode_paiements').onDelete('SET NULL').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
