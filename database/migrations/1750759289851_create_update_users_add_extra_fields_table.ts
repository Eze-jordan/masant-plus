import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UpdateUsersSpecialtyField extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    const hasSpecialty = await this.db.schema.hasColumn(this.tableName, 'specialty')

    if (!hasSpecialty) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.string('specialty').nullable()
      })
    }
  }

  public async down() {
    const hasSpecialty = await this.db.schema.hasColumn(this.tableName, 'specialty')

    if (hasSpecialty) {
      await this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('specialty')
      })
    }
  }
}
