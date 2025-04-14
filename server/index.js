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

 