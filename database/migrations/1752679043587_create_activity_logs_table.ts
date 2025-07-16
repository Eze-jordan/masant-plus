import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ActivityLogs extends BaseSchema {
  protected tableName = 'activity_logs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()')) // ID unique pour le log
      table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE') // Référence à l'utilisateur
      table.string('action').notNullable() // Action effectuée
      table.text('details').nullable() // Détails supplémentaires sur l'action
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()) // Date et heure de création
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now()) // Date et heure de la mise à jour
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName) // Suppression de la table si nécessaire
  }
}
