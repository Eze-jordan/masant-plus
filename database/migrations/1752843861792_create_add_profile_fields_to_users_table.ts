import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddProfileFieldsToUsers extends BaseSchema {
  public async up() {
    this.schema.alterTable('users', (table) => {
      table.date('date_naissance').nullable()
      table.text('about').nullable()
      table.string('groupe_sanguin').nullable()
    })
  }

  public async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('date_naissance')
      table.dropColumn('about')
      table.dropColumn('groupe_sanguin')
    })
  }
}
