import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public label!: string

  @hasMany(() => User)
  public users!: HasMany<typeof User>
}
