import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateCreneaux extends BaseSchema {
  protected tableName = 'creneaux'

  public async up() {
    // Vérifier si la colonne existe déjà dans la table
    const columnExists = await this.schema.hasColumn(this.tableName, 'idDisponibilite')
    
    if (!columnExists) {
      this.schema.table(this.tableName, (table) => {
        table.uuid('idDisponibilite').notNullable()
          .references('id').inTable('disponibilites')
          .onDelete('CASCADE')
      })
    }
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('idDisponibilite')
    })
  }
}
