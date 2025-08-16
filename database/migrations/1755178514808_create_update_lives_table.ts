import { BaseSchema } from "@adonisjs/lucid/schema"

export default class UpdateLiveTable extends BaseSchema {
  protected tableName = 'lives'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('doctor_id').nullable()
      table.string('patient_id').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('doctor_id')
      table.dropColumn('patient_id')
    })
  }
}
