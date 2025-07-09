import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterUsersProfileImageLongtext extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('profile_image').alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('profile_image', 255).alter()
    })
  }
}
