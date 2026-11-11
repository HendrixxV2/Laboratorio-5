const OpenAI = require('openai');

function errorHandler(err, req, res, next) {
  console.error(err);

  // Manejo de errores específicos de la API de DeepSeek / OpenAI
  if (err instanceof OpenAI.APIError) {
    const status = err.status === 429 ? 429 : 502;
    return res.status(status).json({ error: 'IA NO DISPONIBLE' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
}

module.exports = errorHandler;