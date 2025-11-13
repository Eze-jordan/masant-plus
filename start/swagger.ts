import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API MasantePlus',
      version: '1.0.0',
      description: 'Documentation Swagger de MasantePlus',
    },
    servers: [
      {
        url: 'https://api-masanteplus.solutech-one.com',
      },
    ],
  },

  // Indiquer où Swagger doit trouver les commentaires @swagger
  apis: [
    './app/Controllers/**/*.ts',
    './start/swagger/docs.ts',
  ],
})


export default swaggerSpec