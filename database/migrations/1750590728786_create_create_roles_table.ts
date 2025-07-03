import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Clé primaire UUID (string) à la place d'un entier auto-incrémenté
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      table.string('label').notNullable().unique()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
