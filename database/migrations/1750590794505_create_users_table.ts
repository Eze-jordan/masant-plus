import { BaseSchema } from '@adonisjs/lucid/schema'
import { Status } from '../../app/enum/enums.js' // ajuste le chemin selon l’emplacement réel de ton enum

export default class Users extends BaseSchema {
  protected tableName = 'users'
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      
      // Champs communs
      table.string('email').unique().nullable()
      table.string('phone').nullable()
      table.string('password').nullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('profile_image').nullable() // Ajouté pour correspondre au modèle
      table.enum('account_status', Object.values(Status)).nullable()
      table.string('expo_push_token').nullable() // Ajouté pour le modèle
  
      // Discriminant pour l'héritage
      table.enum('type', ['doctor', 'patient', 'admin']).defaultTo('user')
  
      // Champs spécifiques aux docteurs (peuvent être null)
      table.string('license_number').nullable()
      table.string('specialisation').nullable()
  
      // Champs spécifiques aux patients
      table.string('address').nullable()
  
      // Clé étrangère
      table.uuid('role_id').nullable()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')
  
      table.timestamps(true)
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
