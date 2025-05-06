const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const sequelize = require('./config/database');
const fs = require('fs');
const path = require('path');

require('dotenv').config();



const {PORT} = process.env;



const app = express();



app.use(cors()); //usar el corss
app.use(express.json()); // Middleware para parsear JSON
app.use(bodyparser.json());
app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Rutas
app.use('/sge/auth', require('./routes/auth'));
app.use('/sge/users', require('./routes/users'));
app.use('/sge/estudiantes', require('./routes/estudiantes'));
app.use('/sge/representantes', require('./routes/representantes'));
app.use('/sge/autorizados', require('./routes/autorizados'));
app.use('/sge/personals', require('./routes/personal'));
app.use('/sge/eventos' , require('./routes/eventos') );
app.use('/sge/secciones' , require('./routes/secciones') );

app.use( '*', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public/index.html' ) );
  } );

  sequelize.sync({ force: false })
  .then(() => {
      console.log('Base de datos y tablas sincronizadas');
      // ¡CAMBIO AQUÍ! Añade '0.0.0.0' como segundo argumento
      app.listen(PORT || 8000, '0.0.0.0', () => { // Usar PORT o un default como 8000
          // Obtén la IP local de tu máquina para mostrarla (opcional pero útil)
          const interfaces = require('os').networkInterfaces();
          let localIp = 'localhost'; // Default
          for (const name of Object.keys(interfaces)) {
              for (const iface of interfaces[name]) {
                  const { address, family, internal } = iface;
                  if (family === 'IPv4' && !internal) {
                      localIp = address;
                      break;
                  }
              }
              if (localIp !== 'localhost' && !localIp.startsWith('127.')) break; // Salir si ya encontramos una IP local válida
          }
          console.log(`Servidor escuchando en el puerto ${PORT || 8000}`);
          console.log(`Accesible en la máquina local como: http://localhost:${PORT || 8000}`);
          console.log(`Accesible en la red local como (si la IP es correcta y el firewall lo permite): http://${localIp}:${PORT || 8000}`);
      });
  })
  .catch((err) => {
      console.error('Error al sincronizar la base de datos:', err);
  });
 