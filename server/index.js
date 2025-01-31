const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); //usar el corss
app.use(express.json()); // Middleware para parsear JSON

//Rutas
app.route('sge/auth', require('./routes/auth'));

app.listen(port, async () => {
    try {
      await sequelize.sync({ force: true });
      console.log(`Servidor corriendo en http://localhost:${port}`);
    } catch (error) {
      console.log('Error al sincronizar la base de datos:', error);
    }
  });

  