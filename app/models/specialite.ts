import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Specialite extends BaseModel {
  @column({ isPrimary: true })
  public id!: string // changer en string pour UUID

  @column()
  public label!: string

  @column()
  public description?: string

  @column()
  public icon?: string

  @manyToMany(() => User, {
    pivotTable: 'specialite_doctors',
    pivotForeignKey: 'idSpecialite',      // doit matcher la colonne dans la table pivot
    pivotRelatedForeignKey: 'idDoctor',    // idem ici
  })
  public doctors!: ManyToMany<typeof User>
}
