import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Specialite extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @column()
  public label!: string

  @column()
  public description?: string

  @column()
  public icon?: string

  @column()
  public color?: string 

  @manyToMany(() => User, {
    pivotTable: 'specialite_doctors',
    pivotForeignKey: 'specialite_id',        // 👈 match DB
    pivotRelatedForeignKey: 'doctor_id',     // 👈 match DB
  })
  public doctors!: ManyToMany<typeof User>
}
