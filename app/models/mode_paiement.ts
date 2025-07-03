import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import Paiement from './paiement.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'

export default class ModePaiement extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(modePaiement: ModePaiement) {
    modePaiement.id = randomUUID()
  }

  @column()
  public label!: string

  @hasMany(() => Paiement)
  public paiements!: HasMany<typeof Paiement>
}
