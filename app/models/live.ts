import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import LiveUser from './liveUser.js' // ou ./LiveUser si c’est le vrai nom du fichier
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Live extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public name!: string

  // Nouveaux champs pour le doctor et patient
  @column()
  public doctorId!: string

  @column()
  public patientId!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @hasMany(() => LiveUser)
  public liveUsers!: HasMany<typeof LiveUser>

  /**
   * Hook before creating a live to assign a UUID
   */
  @beforeCreate()
  public static assignUuid(live: Live) {
    live.id = randomUUID()
  }
}
