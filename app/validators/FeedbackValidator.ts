import vine from '@vinejs/vine'

// Définir le schéma de validation
const schema = vine.object({
  idUser: vine.string(), // ID utilisateur requis et positif
  sujet: vine.string().optional(), // Sujet optionnel
  message: vine.string(), // Message requis
  note: vine.number().min(1).max(5), // Note entre 1 et 5, requise
})

// Compiler le schéma avec vine.compile
export const createFeedbackValidator = vine.compile(schema)
