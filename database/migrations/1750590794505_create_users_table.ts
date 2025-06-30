import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '../../app/enum/enums.js' // ajuste le chemin selon l’emplacement réel de ton enum

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      // Utilisation d'un UUID comme clé primaire
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))

      table.string('username').nullable()
      table.string('email').unique().nullable()
      table.string('phone').nullable()
      table.string('password').nullable()

      table.string('availability').nullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('registration_number').nullable()
      table.string('institution_name').nullable()
      table.string('certificate_url').nullable()

      table.string('license_number').nullable()
      table.string('certificate').nullable()
      table.string('institution').nullable()
      table.string('address').nullable()
      table.string('specialty').nullable()
      table.string('experience').nullable()
      table.enum('account_status', Object.values(Status)).nullable()
      table.text('about').nullable()
      table.string('years_experience').nullable()
      table.string('specialisation').nullable()
      table.string('localisation').nullable()

      // role_id doit être UUID et nullable, on fait référence à roles(id) qui est aussi UUID
      table.uuid('role_id').nullable()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
