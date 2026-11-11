const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lab 5: Notas + DeepSeek IA', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Nota: {
          type: 'object',
          required: ['id', 'titulo', 'contenido'],
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Mi nota' },
            contenido: { type: 'string', example: 'Contenido de la nota' }
          }
        },
        NotaEntrada: {
          type: 'object',
          required: ['titulo', 'contenido'],
          properties: {
            titulo: { type: 'string', minLength: 1, maxLength: 100 },
            contenido: { type: 'string', minLength: 1, maxLength: 5000 }
          }
        },
        NotaParcial: {
          type: 'object',
          minProperties: 1,
          properties: {
            titulo: { type: 'string', minLength: 1, maxLength: 100 },
            contenido: { type: 'string', minLength: 1, maxLength: 5000 }
          }
        },
        Pregunta: {
          type: 'object',
          required: ['pregunta'],
          properties: {
            pregunta: { type: 'string' }
          }
        }
      },
      parameters: {
        NotaId: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID entero positivo de la nota',
          schema: { type: 'integer', minimum: 1 }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);