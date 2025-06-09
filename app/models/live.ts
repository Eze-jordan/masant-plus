import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

import LiveUser from './live.js' // Ou ./LiveUser si c’est le vrai nom du fichier


export default class Live extends BaseModel {
  @column({ isPrimary: true })
  declare id: string
  static assignUuid(live: Live) {
    live.id = randomUUID()
  }
  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relation avec LiveUser (pivot)
  @hasMany(() => LiveUser)
  declare liveUsers: HasMany<typeof LiveUser>
}
