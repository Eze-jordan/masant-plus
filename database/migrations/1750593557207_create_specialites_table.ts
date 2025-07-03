import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Specialites extends BaseSchema {
  protected tableName = 'specialites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('label').notNullable()
      table.string('description').nullable()
      table.string('icon').nullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
