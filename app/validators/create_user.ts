import vine from '@vinejs/vine'
import { Status } from '../enum/enums.js'

const schemaDocteur = vine.object({
  first_name: vine.string().optional(),
  last_name: vine.string().optional(),
  licenseNumber: vine.string().optional(),
  email: vine.string().trim(),
  phone: vine.string().optional(),
  password: vine.string(),
  account_status: vine.enum(Object.values(Status)).optional(),
  specialisation: vine.string().optional(),
  role: vine.string().trim().optional(),
  type: vine.literal('doctor'), // Force le type 'doctor'

})
export const createDocteurValidator = vine.compile(schemaDocteur)

const schemaPatient = vine.object({
  first_name: vine.string().optional(),
  last_name: vine.string().optional(),
  email: vine.string().trim(),
  phone: vine.string().optional(),
  password: vine.string(),
  account_status: vine.enum(Object.values(Status)).optional(),
  role: vine.string().trim().optional(),
  type: vine.literal('patient'), // Force le type 'doctor'

})
export const createPatientValidator = vine.compile(schemaPatient)


