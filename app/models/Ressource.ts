import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Ressource extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public url!: string

  @column()
  public titre!: string

  @column()
  public date!: string // exemple : '07/05/2000'

  @column()
  public userId!: string

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
