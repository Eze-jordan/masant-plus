import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddJourToCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('jour', 20).nullable().after('date') // nullable pour éviter l'erreur
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('jour')
    })
  }
}
