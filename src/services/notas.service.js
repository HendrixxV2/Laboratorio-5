let notas = [];
let nextId = 1;

const listar = () => notas;

function buscar(id) {
  const n = notas.find(n => n.id === id);
  if (!n) throw { status: 404, message: 'Nota no encontrada' };
  return n;
}

function crear({ titulo, contenido }) {
  const n = { id: nextId++, titulo, contenido };
  notas.push(n);
  return n;
}

function eliminar(id) {
  const index = notas.findIndex(n => n.id === id);
  if (index === -1) throw { status: 404, message: 'Nota no encontrada' };
  return notas.splice(index, 1)[0];
}

module.exports = { listar, buscar, crear, eliminar };