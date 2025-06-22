import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import ServiceDoctor from './service_doctor.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public label!: string

  @column()
  public prix!: number

  @column()
  public icon?: string

  @hasMany(() => ServiceDoctor, { foreignKey: 'idService' })
  public doctors!: HasMany<typeof ServiceDoctor>
}
