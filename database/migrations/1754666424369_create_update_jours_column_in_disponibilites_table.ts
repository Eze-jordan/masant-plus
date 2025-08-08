import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateJoursColumnInDisponibilites extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Modifie la colonne 'jours' pour qu'elle soit de type json
      table.json('jours').nullable().alter().comment('Jours de la semaine sélectionnés (ex: ["lundi", "mercredi"])')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Ici, vous pouvez simplement supprimer la colonne si nécessaire
      table.dropColumn('jours')
    })
  }
}
