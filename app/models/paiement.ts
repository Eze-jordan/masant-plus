import { DateTime } from 'luxon'
import User from './user.js'
import Appointment from './appointment.js'
import ModePaiement from './mode_paiement.js'
import { StatusPaiement } from '../enum/enums.js'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Paiement extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public idUser!: number

  @column()
  public idAppointment!: number

  @column()
  public montant!: number

  @column()
  public statut!: keyof typeof StatusPaiement

  @column.dateTime()
  public datePaiement!: DateTime

  @column()
  public modeId!: number

  @belongsTo(() => User, { foreignKey: 'idUser' })
  public user!: BelongsTo<typeof User>

  @belongsTo(() => Appointment, { foreignKey: 'idAppointment' })
  public appointment!: BelongsTo<typeof Appointment>

  @belongsTo(() => ModePaiement, { foreignKey: 'modeId' })
  public mode!: BelongsTo<typeof ModePaiement>
}
