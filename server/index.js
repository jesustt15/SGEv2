const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();



const {PORT} = process.env;

const app = express();

app.use(cors()); //usar el corss
app.use(express.json()); // Middleware para parsear JSON

//Rutas
app.use('/sge/auth', require('./routes/auth'));

app.listen(PORT, async () => {
    try {
      await sequelize.sync({ force: true });
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    } catch (error) {
      console.log('Error al sincronizar la base de datos:', error);
    }
  });

  