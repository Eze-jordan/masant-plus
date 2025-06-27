import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Appointments extends BaseSchema {
  protected tableName = 'appointments'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('id_user').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('id_doctor').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('date_rdv', { useTz: true }).notNullable()
      table.string('heure_debut').notNullable()
      table.string('heure_fin').notNullable()

      table.enum('type_rdv', ['APPEL', 'VIDEO', 'PHYSIQUE'], {
        useNative: true,
        enumName: 'appointment_type_enum',
      }).notNullable()

      table.enum('etat_rdv', ['PENDING', 'ANNULE', 'CONFIRME'], {
        useNative: true,
        enumName: 'appointment_status_enum',
      }).notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
