const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Lab 5: Notas + DeepSeek IA', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      schemas: {
        Pregunta: {
          type: 'object',
          required: ['pregunta'],
          properties: {
            pregunta: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);