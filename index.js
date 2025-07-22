require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const proveedoresRoutes = require('./routes/proveedores');
const clientesRoutes = require('./routes/clientes');
const importacionesRoutes = require('./routes/importaciones');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/importaciones',importacionesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
