import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  public static assignUuid(role: Role) {
    role.id = randomUUID()
  }

  @column()
  public label!: string

  @hasMany(() => User)
  public users!: HasMany<typeof User>
}
