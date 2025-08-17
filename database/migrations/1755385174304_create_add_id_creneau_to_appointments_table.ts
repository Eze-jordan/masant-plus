import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameIdCreneauToIdCreneauInAppointments extends BaseSchema {
  public async up() {
    this.schema.alterTable('appointments', (table) => {
      table.renameColumn('idCreneau', 'id_creneau') // Renommer la colonne
    })
  }

  public async down() {
    this.schema.alterTable('appointments', (table) => {
      table.renameColumn('id_creneau', 'idCreneau') // Revenir à l'ancien nom si rollback
    })
  }
}
