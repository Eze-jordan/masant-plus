import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddNumeroTelephoneToPaiements extends BaseSchema {
  protected tableName = 'paiements'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('numero_telephone')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('numero_telephone')
    })
  }
}
