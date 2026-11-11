const router = require('express').Router();
const { z } = require('zod');
const notas = require('../services/notas.service');
const deepseek = require('../services/deepseek.service');
const validar = require('../middlewares/validar');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});

router.get('/', (req, res) => {
  res.json(notas.listar());
});

router.get('/:id', (req, res, next) => {
  try {
    res.json(notas.buscar(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
});

router.post('/', validar(notaSchema), (req, res) => {
  const nuevaNota = notas.crear(req.body);
  res.status(201).json(nuevaNota);
});

router.delete('/:id', (req, res, next) => {
  try {
    const eliminada = notas.eliminar(Number(req.params.id));
    res.json({ mensaje: 'Nota eliminada', eliminada });
  } catch (err) {
    next(err);
  }
});

// Endpoint extra: Resume una nota usando DeepSeek
router.post('/:id/resumen', async (req, res, next) => {
  try {
    const nota = notas.buscar(Number(req.params.id));
    const r = await deepseek.preguntar(
      nota.contenido,
      'Resume el texto en 3 viñetas breves, en español.'
    );
    res.json({ notaId: nota.id, resumen: r.respuesta });
  } catch (err) {
    next(err);
  }
});

module.exports = router;