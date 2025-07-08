import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import LiveUser from './liveUser.js' // ou ./LiveUser si c’est le vrai nom du fichier
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Live extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public name!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => LiveUser)
  public liveUsers!: HasMany<typeof LiveUser>
  static assignUuid: (live: Live) => void
}

Live.assignUuid = function (live: Live) {
  live.id = randomUUID()
}
