
// utils/Jwt.ts
import jwt, { JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret'

export function generateJwtToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwtToken(token: string): JwtPayload & { id: string; email: string } {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & { id: string; email: string }
}
