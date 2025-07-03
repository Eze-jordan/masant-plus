import { BaseSchema } from "@adonisjs/lucid/schema"

export default class UpdateDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Par exemple, si tu veux modifier la colonne 'heureDebut' pour qu'elle soit nullable :
      table.string('heureDebut').nullable().alter()

      // Ajouter une nouvelle colonne, par exemple 'description' pour stocker une note ou une description
      table.text('description').nullable()

      // Si tu veux supprimer une colonne qui n'est plus nécessaire, par exemple 'jour' :
      table.dropColumn('jour')

      // Tu peux également ajouter des index ou d'autres colonnes si nécessaire
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Revenir en arrière si nécessaire
      table.dropColumn('description')
      table.string('jour').notNullable()
    })
  }
}
