import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Live from './live.js'
import User from './user.js'

export default class LiveUser extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public liveId!: string

  @column()
  public userId!: string

  @belongsTo(() => Live, {
    foreignKey: 'liveId',
  })
  public live!: BelongsTo<typeof Live>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  public user!: BelongsTo<typeof User>
}
