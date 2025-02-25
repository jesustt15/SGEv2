const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const sequelize = require('./config/database');
require('dotenv').config();



const {PORT} = process.env;

const app = express();

app.use(cors()); //usar el corss
app.use(express.json()); // Middleware para parsear JSON
app.use(bodyparser.json());

//Rutas
app.use('/sge/auth', require('./routes/auth'));
app.use('/sge/users', require('./routes/users'));
app.use('/sge/estudiantes', require('./routes/estudiantes'));
app.use('/sge/representantes', require('./routes/representantes'));
app.use('/sge/autorizados', require('./routes/autorizados'));
app.use('/sge/personal', require('./routes/personal'));


sequelize.sync({ force: false }) // Asegúrate de usar { force: false } en producción
    .then(() => {
        console.log('Base de datos y tablas sincronizadas');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });

 