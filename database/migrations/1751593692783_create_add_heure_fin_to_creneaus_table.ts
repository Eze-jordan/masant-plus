import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddHeureFinToCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('heure_fin').notNullable()  // Ajoute la colonne heure_fin
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('heure_fin')  // Supprime la colonne si la migration est annulée
    })
  }
}
