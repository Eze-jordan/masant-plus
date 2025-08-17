import { DateTime } from 'luxon'
import User from './user.js'
import Appointment from './appointment.js'
import ModePaiement from './mode_paiement.js'
import { StatusPaiement } from '../enum/enums.js'
import { BaseModel, belongsTo, column, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class Paiement extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(paiement: Paiement) {
    paiement.id = randomUUID()
  }

  @column()
  public idUser!: string

  @column()
  public idAppointment!: string

  @column()
  public montant!: number

  @column()
  public statut!: keyof typeof StatusPaiement

  @column.dateTime()
  public datePaiement!: DateTime

  @column()
  public modeId!: string

    @column()
  public billing_id!: string

  @column()
public numeroTelephone!: string


  @belongsTo(() => User, { foreignKey: 'idUser' })
  public user!: BelongsTo<typeof User>

  @belongsTo(() => Appointment, { foreignKey: 'idAppointment' })
  public appointment!: BelongsTo<typeof Appointment>

  @belongsTo(() => ModePaiement, { foreignKey: 'modeId' })
  public mode!: BelongsTo<typeof ModePaiement>
}
