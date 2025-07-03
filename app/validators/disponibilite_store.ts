import vine from '@vinejs/vine'

// Définir le schéma de validation
const schema = vine.object({
  idDoctor: vine.string().uuid(),
  jour: vine.date(),
  heureDebut: vine.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  heureFin: vine.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  dateDebut: vine.date(),
  dateFin: vine.date(),
  actif: vine.boolean(),
})

// Compiler le schéma avec vine.compile
const disponibiliteValidator = vine.compile(schema)

export default disponibiliteValidator
