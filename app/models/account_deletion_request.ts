// app/Models/AccountDeletionRequest.ts

import { BaseModel, column, beforeCreate } from "@adonisjs/lucid/orm"
import { randomUUID } from "node:crypto"

export default class AccountDeletionRequest extends BaseModel {
  @column({ isPrimary: true })
  public id!: string

  @beforeCreate()
  static assignUuid(request: AccountDeletionRequest) {
    request.id = randomUUID()
  }

  @column()
  public userId!: string

  @column()
  public reason!: string

  @column()
  public processed!: boolean
}
