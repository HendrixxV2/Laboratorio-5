const router = require('express').Router();
const { z } = require('zod');
const notas = require('../services/notas.service');
const deepseek = require('../services/deepseek.service');
const validar = require('../middlewares/validar');

const notaSchema = z.object({
  titulo: z.string().min(1).max(100),
  contenido: z.string().min(1).max(5000),
});
const notaParcialSchema = notaSchema.partial().refine(
  datos => Object.keys(datos).length > 0,
  { message: 'Debes enviar al menos titulo o contenido' }
);

function obtenerIdNota(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw { status: 400, message: 'El id debe ser un entero positivo' };
  }
  return id;
}

/**
 * @openapi
 * /api/notas:
 *   get:
 *     summary: Lista todas las notas
 *     tags: [Notas]
 *     responses:
 *       200:
 *         description: Lista de notas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nota'
 */
router.get('/', (req, res) => {
  res.json(notas.listar());
});

/**
 * @openapi
 * /api/notas/{id}:
 *   get:
 *     summary: Busca una nota por su ID
 *     tags: [Notas]
 *     parameters:
 *       - $ref: '#/components/parameters/NotaId'
 *     responses:
 *       200:
 *         description: Nota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Nota no encontrada
 */
router.get('/:id', (req, res, next) => {
  try {
    res.json(notas.buscar(obtenerIdNota(req)));
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/notas:
 *   post:
 *     summary: Crea una nota
 *     tags: [Notas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaEntrada'
 *     responses:
 *       201:
 *         description: Nota creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validar(notaSchema), (req, res) => {
  const nuevaNota = notas.crear(req.body);
  res.status(201).json(nuevaNota);
});

/**
 * @openapi
 * /api/notas/{id}:
 *   put:
 *     summary: Reemplaza el contenido de una nota
 *     tags: [Notas]
 *     parameters:
 *       - $ref: '#/components/parameters/NotaId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaEntrada'
 *     responses:
 *       200:
 *         description: Nota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         description: ID o datos inválidos
 *       404:
 *         description: Nota no encontrada
 */
router.put('/:id', validar(notaSchema), (req, res, next) => {
  try {
    res.json(notas.actualizar(obtenerIdNota(req), req.body));
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/notas/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una nota
 *     tags: [Notas]
 *     parameters:
 *       - $ref: '#/components/parameters/NotaId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotaParcial'
 *     responses:
 *       200:
 *         description: Nota actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nota'
 *       400:
 *         description: ID o datos inválidos
 *       404:
 *         description: Nota no encontrada
 */
router.patch('/:id', validar(notaParcialSchema), (req, res, next) => {
  try {
    res.json(notas.actualizarParcial(obtenerIdNota(req), req.body));
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/notas/{id}:
 *   delete:
 *     summary: Elimina una nota
 *     tags: [Notas]
 *     parameters:
 *       - $ref: '#/components/parameters/NotaId'
 *     responses:
 *       200:
 *         description: Nota eliminada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Nota no encontrada
 */
router.delete('/:id', (req, res, next) => {
  try {
    const eliminada = notas.eliminar(obtenerIdNota(req));
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