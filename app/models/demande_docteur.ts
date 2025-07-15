// app/models/demande_docteur.ts
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'

export default class DemandeDocteur extends BaseModel {
  @column({ isPrimary: true })
  public id!: string
  
  @beforeCreate()
  static assignUuid(demandedocteur: DemandeDocteur) {
    demandedocteur.id = randomUUID()
  }

  @column()
  public firstName!: string

  @column()
  public lastName!: string

  @column()
  public email!: string

  @column()
  public phone?: string

  @column()
  public licenseNumber?: string

  @column()
  public specialisation?: string

  @column()
  public status!: 'pending' | 'approved' | 'rejected'

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}


