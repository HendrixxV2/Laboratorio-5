const router = require('express').Router();
const { z } = require('zod');
const deepseek = require('../services/deepseek.service');
const validar = require('../middlewares/validar');

const preguntaSchema = z.object({
  pregunta: z.string().min(3).max(2000),
});

/**
 * @openapi
 * /api/ia/preguntar:
 *   post:
 *     summary: Envía una pregunta a DeepSeek
 *     tags: [IA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pregunta]
 *             properties:
 *               pregunta:
 *                 type: string
 *     responses:
 *       200:
 *         description: Respuesta del modelo
 *       400:
 *         description: Datos inválidos
 *       502:
 *         description: IA no disponible
 */
router.post('/preguntar', validar(preguntaSchema), async (req, res, next) => {
  try {
    const resultado = await deepseek.preguntar(req.body.pregunta);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

module.exports = router;