import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Disponibilite from './disponibilite.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Creneau extends BaseModel {
  // 🔧 Nom explicite de la table pour éviter "creneaus"
  public static table = 'creneaux'

  // 🆔 ID primaire UUID
  @column({ isPrimary: true })
  public id!: string

  // 🔄 Génère un UUID avant création
  @beforeCreate()
  public static assignUuid(creneau: Creneau) {
    creneau.id = randomUUID()
  }

  // 🔗 Clé étrangère vers disponibilites (colonne BDD : id_disponibilite)
  @column({ columnName: 'id_disponibilite' })
  public idDisponibilite!: string

  // 🕒 Heure de début du créneau
  @column({ columnName: 'heure_debut' })
  public heureDebut!: string

  // 🕒 Heure de fin du créneau
  @column({ columnName: 'heure_fin' })
  public heureFin!: string

  // ✅ Disponible ou non
  @column()
  public disponible!: boolean

  // 🔁 Relation avec la disponibilité
  @belongsTo(() => Disponibilite, {
    foreignKey: 'idDisponibilite',
  })
  public disponibilite!: BelongsTo<typeof Disponibilite>
}
