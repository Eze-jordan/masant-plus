import { BaseSchema } from "@adonisjs/lucid/schema"

export default class Creneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Ajout de la colonne 'date' en string (format "YYYY-MM-DD")
      // nullable pour ne pas bloquer la migration si des données existent déjà
      table.string('date').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('date')
    })
  }
}
