const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Obtener todas las importaciones
router.get('/', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM importaciones');
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener importaciones:', err);
    res.status(500).json({ error: 'Error al obtener importaciones' });
  }
});

// Registrar una nueva importación
router.post('/guardar', async (req, res) => {
  const { producto, cantidad, fecha, proveedor_id, observaciones } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'INSERT INTO importaciones (producto, cantidad, fecha, proveedor_id, observaciones) VALUES (?, ?, ?, ?, ?)',
      [producto, cantidad, fecha, proveedor_id, observaciones]
    );
    await conn.end();
    res.json({ mensaje: 'Importación registrada correctamente' });
  } catch (err) {
    console.error('Error al guardar importación:', err);
    res.status(500).json({ error: 'Error al guardar importación' });
  }
});

// Editar una importación existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { producto, cantidad, fecha, proveedor_id, observaciones } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute(
      'UPDATE importaciones SET producto = ?, cantidad = ?, fecha = ?, proveedor_id = ?, observaciones = ? WHERE id = ?',
      [producto, cantidad, fecha, proveedor_id, observaciones, id]
    );
    await conn.end();
    res.json({ mensaje: 'Importación actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar importación:', err);
    res.status(500).json({ error: 'Error al actualizar importación' });
  }
});

// Eliminar una importación
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('DELETE FROM importaciones WHERE id = ?', [id]);
    await conn.end();
    res.json({ mensaje: 'Importación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar importación:', err);
    res.status(500).json({ error: 'Error al eliminar importación' });
  }
});

module.exports = router;
