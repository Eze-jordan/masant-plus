import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SpecialiteDoctors extends BaseSchema {
  protected tableName = 'specialite_doctors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      
      table.integer('specialite_id').unsigned().notNullable()
        .references('id').inTable('specialites')
        .onDelete('CASCADE')
      
      table.integer('doctor_id').unsigned().notNullable()
        .references('id').inTable('users')
        .onDelete('CASCADE')
      
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      table.unique(['specialite_id', 'doctor_id']) // éviter doublons
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
