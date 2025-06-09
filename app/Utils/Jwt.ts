import jwt from 'jsonwebtoken'

export function generateJwtToken(user: { id: number; email: string }) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET est manquant dans le fichier .env')
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: '7d',
    }
  )
}
