import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddStatusToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Ajoute la colonne 'status' avec les valeurs possibles 'online' et 'offline'
      table.enu('status', ['online', 'offline']).defaultTo('offline') // 'offline' est la valeur par défaut
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Supprime la colonne 'status'
      table.dropColumn('status')
    })
  }
}
