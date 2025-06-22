import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Paiement from './paiement.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ModePaiement extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public label!: string

  @hasMany(() => Paiement)
  public paiements!: HasMany<typeof Paiement>
}
