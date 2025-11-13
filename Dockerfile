# Utiliser une image Node légère
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code du projet
COPY . .

# Compiler le projet TypeScript
RUN npm run build

# Exposer le port utilisé par Adonis
EXPOSE 3333

# Commande pour démarrer l’application
CMD ["node", "build/server.js"]
