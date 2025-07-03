import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AddProfileImageToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profile_image').nullable().after('email') // ou after('last_name') selon ton modèle
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('profile_image')
    })
  }
}
