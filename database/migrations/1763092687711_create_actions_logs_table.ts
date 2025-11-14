import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ActionsLogs extends BaseSchema {
  protected tableName = 'actions_logs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // L'ID de l'utilisateur (nullable si guest)
      table.integer('user_id').unsigned().nullable().index()

      // Route / action
      table.string('action', 255).notNullable().index()

      // Méthode HTTP
      table.string('method', 10).notNullable().index()

      // Données envoyées (JSON)
      table.json('payload').nullable()

      // Adresse IP
      table.string('ip_address', 45).nullable().index()

      // User agent
      table.string('user_agent', 512).nullable()

      // Eventuel status code de la réponse (optionnel)
      table.integer('status_code').nullable()

      // Timestamps
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
