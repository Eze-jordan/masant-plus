import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ActivityLog extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public action!: string

  @column()
  public details?: string

  @column()
  public userId!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => User)
    public user!: BelongsTo<typeof User>
}
