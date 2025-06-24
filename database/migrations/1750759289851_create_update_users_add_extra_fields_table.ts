import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateUsersSpecialtyField extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Supprimer colonne mal nommée si elle existe
      table.dropColumn('speciality') // pas de `.catch` ici, Adonis ne supporte pas
      // Ajouter la colonne 'specialty' si elle n'existe pas
      table.string('specialty').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('specialty')
      table.string('speciality').nullable()
    })
  }
}
