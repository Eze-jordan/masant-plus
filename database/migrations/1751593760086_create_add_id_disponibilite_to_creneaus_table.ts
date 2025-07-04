import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddIdDisponibiliteToCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.uuid('id_disponibilite').notNullable()  // Ajoute la colonne id_disponibilite
      table.foreign('id_disponibilite').references('id').inTable('disponibilites').onDelete('CASCADE')  // Ajoute la contrainte de clé étrangère
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('id_disponibilite')  // Supprime la colonne si la migration est annulée
    })
  }
}
