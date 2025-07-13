import { BaseSchema } from '@adonisjs/lucid/schema'
export default class AddExpoPushTokenToUsers extends BaseSchema {
  public async up () {
    this.schema.alterTable('users', (table) => {
      table.string('expo_push_token').nullable()
    })
  }

  public async down () {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('expo_push_token')
    })
  }
}
