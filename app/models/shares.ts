import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Share extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare doctorId: string

  @column()
  declare patientId: string

  @column()
  declare link: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'doctorId',
    onQuery: (query) => {
      query.where('type', 'doctor')
    }
  })
  declare doctor: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'patientId',
    onQuery: (query) => {
      query.where('type', 'patient')
    }
  })
  declare patient: BelongsTo<typeof User>
}
