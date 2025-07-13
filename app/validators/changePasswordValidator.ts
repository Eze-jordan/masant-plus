import vine from '@vinejs/vine'

export const changePasswordSchema = vine.object({
  current_password: vine.string().trim()
,
  password: vine
    .string()
    .trim()
    .minLength(8)
    .confirmed(), // attend un champ `password_confirmation`
})
