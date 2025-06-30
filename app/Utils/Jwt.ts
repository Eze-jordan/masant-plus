import jwt from 'jsonwebtoken'
export function generateJwtToken(user: { id: string | number; email: string | undefined }) {
  const secret = process.env.JWT_SECRET || 'boulinguiboulingui';

  if (typeof secret !== 'string') {
    throw new Error('Le secret JWT n\'est pas défini ou invalide.');
  }

  if (!user.email) {
    throw new Error('L\'email de l\'utilisateur est requis.');
  }

  return jwt.sign(
    {
      id: String(user.id), // 🧠 Toujours transformer en string pour le token
      email: user.email,
    },
    secret,
    { expiresIn: '7d' }
  );
}
