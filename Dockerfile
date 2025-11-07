# Étape 1 : builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers package
COPY package*.json ./

# Installation des dépendances
RUN npm install --production=false

# Copie du reste des fichiers
COPY . .

# Build de l'app Adonis
RUN node ace build

# Étape 2 : image finale
FROM node:20-alpine
WORKDIR /app

# Copier le build depuis le conteneur builder
COPY --from=builder /app/build ./build
COPY package*.json ./

# Installer seulement les dépendances de prod
RUN npm ci --omit=dev

EXPOSE 3333

# CMD correct pour Adonis 5
CMD ["node", "build/bin/server.js"]
