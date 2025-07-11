import vine from '@vinejs/vine'
import { Status } from '../enum/enums.js'

const schemaDocteur = vine.object({
  username: vine.string().trim().optional(),
  first_name: vine.string().optional(),
  last_name: vine.string().optional(),
  registration_number: vine.string().optional(),
  institution_name: vine.string().optional(),
  certificate_url: vine.string().url().optional(),
  email: vine.string().trim().optional(),
  phone: vine.string().optional(),
  password: vine.string().optional(),
  availability: vine.string().optional(),
  account_status: vine.enum(Object.values(Status)).optional(),
  about: vine.string().optional(),
  years_experience: vine.number().positive().optional(),
  specialisation: vine.string().optional(),
  localisation: vine.string().optional(),
  address: vine.string().optional(),      // <-- Ajout ici
  role: vine.string().trim().optional(),
})
export const createDocteurValidator = vine.compile(schemaDocteur)


const schemaPatient = vine.object({
  username: vine.string().trim().optional(),
  last_name: vine.string().optional(),
  email: vine.string(),
  phone: vine.string().optional(),
  password: vine.string(),
  address: vine.string().optional(),  
})

export const createPatientValidator = vine.compile(schemaPatient)
