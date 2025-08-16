import { BaseSchema } from "@adonisjs/lucid/schema"

export default class Medications extends BaseSchema {
  protected tableName = 'medications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('name').notNullable()
      table.string('dci').nullable()
      table.string('form').nullable()
      table.string('dosage').nullable()
      table.string('route').nullable()
      table.text('indications').nullable()
      table.text('contraindications').nullable()
      table.text('side_effects').nullable()
      table.string('laboratory').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
