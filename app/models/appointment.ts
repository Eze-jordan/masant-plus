import { DateTime } from 'luxon'
import User from './user.js'
import Prescription from './prescription.js'
import Review from './review.js'
import Paiement from './paiement.js'
import { TypeRDV, EtatRDV } from '../enum/enums.js'
import { BaseModel, belongsTo, column, hasMany, hasOne, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Creneau from './creneau.js'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(appointment: Appointment) {
    appointment.id = randomUUID()
  }

  @column()
  public idUser!: string

  @column()
  public idDoctor!: string

  @column.dateTime()
  public dateRdv!: DateTime

  @column()
  public heureDebut!: string

  @column()
  public idCreneau!: string  // Make sure this is a UUID of the Creneau

  @column()
  public heureFin!: string

  @column()  // Optional field, description may or may not be provided
  public description?: string

  @column()
  public typeRdv!: keyof typeof TypeRDV

  @column()
  public etatRdv!: keyof typeof EtatRDV

  // Relationships
  @belongsTo(() => User, { foreignKey: 'idUser' })
  public patient!: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'idDoctor' })
  public doctor!: BelongsTo<typeof User>

  @hasMany(() => Paiement, { foreignKey: 'idAppointment' })
  public paiements!: HasMany<typeof Paiement>

  @hasOne(() => Prescription, { foreignKey: 'idAppointment' })
  public prescription!: HasOne<typeof Prescription>

  @belongsTo(() => Creneau, { foreignKey: 'idCreneau' })
  public creneau!: BelongsTo<typeof Creneau>  // Link to the Creneau model

  @hasMany(() => Review, { foreignKey: 'idAppointment' })
  public reviews!: HasMany<typeof Review>  // Fixed plural name of reviews
}
