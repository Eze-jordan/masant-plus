import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API AdonisJS',
    version: '1.0.0',
    description: 'Documentation de l’API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur local',
    },
  ],
}

const options = {
  swaggerDefinition,
  apis: ['app/Controllers/Http/**/*.ts', 'start/routes.ts'], // utilise .ts au lieu de .js si tu es en TypeScript
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
