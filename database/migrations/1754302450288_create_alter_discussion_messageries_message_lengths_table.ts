import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AlterDiscussionMessageriesMessageLength extends BaseSchema {
  protected tableName = 'discussion_messageries'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Modification du type de VARCHAR(255) à TEXT (illimité)
      table.text('message').alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Retour à VARCHAR(255) - Note: les données tronquées seront perdues
      table.string('message', 255).alter()
    })
  }
}