import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ActionsLogs extends BaseModel {
    public static table = 'actions_logs'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number | null

  @column()
  public action!: string

  @column()
  public method!: string

  @column()
  public payload!: any

  @column()
  public ipAddress!: string | null

  @column()
  public userAgent!: string | null

  @column()
  public statusCode!: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime
}
