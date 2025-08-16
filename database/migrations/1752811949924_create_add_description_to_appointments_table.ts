import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddDescriptionToAppointments extends BaseSchema {
  protected tableName = 'appointments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description')
    })
  }
}
