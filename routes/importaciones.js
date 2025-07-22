const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Configura tu conexión MySQL (Clever Cloud)
const connection = mysql.createConnection({
  host: 'btr8n8akqwxc6vnomsix-mysql.services.clever-cloud.com',
  user: 'uii9rcdb3molmlqn',
  password: '9eI5GAXdJtQIO9SuT43O',
  database: 'btr8n8akqwxc6vnomsix'
});

connection.connect(error => {
  if (error) throw error;
  console.log('Conexión MySQL - Importaciones establecida');
});

// Obtener todas las importaciones junto con el nombre del proveedor
router.get('/', (req, res) => {
  const sql = `
    SELECT i.id, i.producto, i.cantidad, i.fecha, i.descripcion,
           p.id AS proveedor_id, p.nombre AS proveedor_nombre
    FROM importaciones i
    LEFT JOIN proveedores p ON i.proveedor_id = p.id
  `;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Obtener una importación por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT i.id, i.producto, i.cantidad, i.fecha, i.descripcion,
           p.id AS proveedor_id, p.nombre AS proveedor_nombre
    FROM importaciones i
    LEFT JOIN proveedores p ON i.proveedor_id = p.id
    WHERE i.id = ?
  `;
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Importación no encontrada' });
    res.json(results[0]);
  });
});

// Crear una nueva importación
router.post('/', (req, res) => {
  const { producto, proveedor_id, cantidad, fecha, descripcion } = req.body;
  const nuevaImportacion = { producto, proveedor_id, cantidad, fecha, descripcion };
  connection.query('INSERT INTO importaciones SET ?', nuevaImportacion, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, ...nuevaImportacion });
  });
});

// Actualizar importación
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { producto, proveedor_id, cantidad, fecha, descripcion } = req.body;
  connection.query(
    'UPDATE importaciones SET producto = ?, proveedor_id = ?, cantidad = ?, fecha = ?, descripcion = ? WHERE id = ?',
    [producto, proveedor_id, cantidad, fecha, descripcion, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ mensaje: 'Importación actualizada correctamente' });
    }
  );
});

// Eliminar importación
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM importaciones WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Importación eliminada correctamente' });
  });
});

module.exports = router;
