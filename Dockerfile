# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

# S'assurer que les devDependencies sont installées
ENV NODE_ENV=development

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris dev)
RUN npm install

# Copier le code source
COPY . .

# Construire le projet avec l'assembler
RUN npx node ace build

# Étape 2 : Runtime (léger)
FROM node:20-alpine AS runner
WORKDIR /app

# Passer en mode production
ENV NODE_ENV=production

# Copier uniquement les fichiers nécessaires
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --omit=dev

# Copier la build compilée depuis le builder
COPY --from=builder /app/build ./build

# Copier aussi le fichier .env si nécessaire
COPY .env .env

# Exposer le port du serveur
EXPOSE 3333

# Démarrer le serveur
CMD ["node", "build/server.js"]
