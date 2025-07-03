import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddHeureDebutToDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('heureDebut').notNullable()  // Ajoute la colonne heureDebut
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('heureDebut')  // Supprime la colonne heureDebut
    })
  }
}
