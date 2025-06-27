import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatusPaiement } from '../../app/enum/enums.js' // ajuste le chemin si nécessaire

export default class Paiements extends BaseSchema {
  protected tableName = 'paiements'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_user').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('id_appointment').unsigned().references('id').inTable('appointments').onDelete('CASCADE')

      table.decimal('montant', 10, 2).notNullable()

      table.enum('statut', Object.values(StatusPaiement)).notNullable()

      table.timestamp('date_paiement', { useTz: true }).notNullable()

      table.integer('mode_id').unsigned().references('id').inTable('mode_paiements').onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
