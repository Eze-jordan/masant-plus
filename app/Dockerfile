# Étape 1 : Builder l'application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN node ace build --production

# Étape 2 : Image finale
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build ./
COPY package*.json ./

RUN npm install --production

EXPOSE 3333

CMD ["node", "server.js"]
