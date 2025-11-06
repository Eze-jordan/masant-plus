import { BaseSchema } from "@adonisjs/lucid/schema"

export default class AlterDisponibilitesMakeHoursNullable extends BaseSchema {
  protected tableName = 'disponibilites'

  public async up () {
    // Guard against missing columns when running migration on databases
    // that may have a different schema state
    if (await this.schema.hasColumn(this.tableName, 'heure_debut') || await this.schema.hasColumn(this.tableName, 'heure_fin')) {
      await this.schema.alterTable(this.tableName, (table) => {
        if (true) {
          table.string('heure_debut').nullable().alter()
          table.string('heure_fin').nullable().alter()
        }
      })
    }
  }

  public async down () {
    if (await this.schema.hasColumn(this.tableName, 'heure_debut') || await this.schema.hasColumn(this.tableName, 'heure_fin')) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.string('heure_debut').notNullable().alter()
        table.string('heure_fin').notNullable().alter()
      })
    }
  }
}
