import { BaseSchema } from "@adonisjs/lucid/schema"

export default class ResetHeureDebutInDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('heureDebut')  // Supprimer la colonne existante
      table.string('heureDebut').notNullable()  // La recréer
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('heureDebut')  // Supprimer la colonne si rollback
    })
  }
}
