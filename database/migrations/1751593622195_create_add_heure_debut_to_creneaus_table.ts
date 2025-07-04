import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddHeureDebutToCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('heure_debut').notNullable()  // Ajoute la colonne heure_debut
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('heure_debut')  // Supprime la colonne si la migration est annulée
    })
  }
}
