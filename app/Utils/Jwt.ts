import jwt from 'jsonwebtoken'

export function generateJwtToken(user: { id: number; email: string | undefined }) {
  const secret = process.env.JWT_SECRET || 'boulinguiboulingui'; // Si JWT_SECRET est absent, utilise le secret par défaut

  // Vérifie si le secret est bien défini et est une chaîne de caractères
  if (typeof secret !== 'string') {
    throw new Error('Le secret JWT n\'est pas défini ou invalide.');
  }

  // Vérifie que l'email est bien défini avant de continuer
  if (!user.email) {
    throw new Error('L\'email de l\'utilisateur est requis.');
  }

  // Génère le JWT
  return jwt.sign(
    {
      id: user.id,
      email: user.email, // Maintenant on est sûr que c'est une string
    },
    secret, // Utilisation du secret
    {
      expiresIn: '7d',
    }
  );
}
