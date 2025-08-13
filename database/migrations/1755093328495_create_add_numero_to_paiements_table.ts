import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddNumeroToPaiements extends BaseSchema{
  public async up() {
    this.schema.alterTable('paiements', (table) => {
      table.string('numero', 250).notNullable() // Ajoute la colonne si elle n'existe pas encore
    })
  }

  public async down() {
    this.schema.alterTable('paiements', (table) => {
      table.dropColumn('numero')
    })
  }
}
