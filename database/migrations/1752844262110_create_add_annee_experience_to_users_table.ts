import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAnneeExperienceToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('annee_experience').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('annee_experience')
    })
  }
}
