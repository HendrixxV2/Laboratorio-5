const OpenAI = require('openai');

// Inicializamos el cliente de DeepSeek utilizando su API key y base URL compatibles
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

async function preguntar(texto, system) {
  const systemPrompt = system ?? 'Eres un asistente útil. Responde en español.';

  const completion = await client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: texto }
    ],
    max_tokens: 1024,
  });

  const respuestaTexto = completion.choices[0]?.message?.content ?? '';
  
  return {
    respuesta: respuestaTexto,
    uso: completion.usage // Tokens consumidos (prompt_tokens, completion_tokens)
  };
}

module.exports = { preguntar };