import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddIdCreneauToAppointments extends BaseSchema {
  public async up() {
    this.schema.alterTable('appointments', (table) => {
      table.uuid('idCreneau').nullable()
    })
  }

  public async down() {
    this.schema.alterTable('appointments', (table) => {
      table.dropColumn('idCreneau')
    })
  }
}
