import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import ServiceDoctor from './service_doctor.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(service: Service) {
    service.id = randomUUID()
  }

  @column()
  public label!: string

  @column()
  public prix!: number

  @column()
  public icon?: string

  @hasMany(() => ServiceDoctor, { foreignKey: 'idService' })
  public doctors!: HasMany<typeof ServiceDoctor>
}
