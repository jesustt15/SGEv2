const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Representante = sequelize.define('representantes', {
  
  representante_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM('Madre', 'Padre'),
    allowNull: false,
  },
  apellidosNombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estadoCivil: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  cedulaIdentidad: DataTypes.STRING,
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefonos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ocupacion: DataTypes.STRING,
  trabaja: DataTypes.BOOLEAN,
  direccionTrabajo: DataTypes.STRING,
  telefonoTrabajo: DataTypes.STRING,
  foto: DataTypes.STRING, // Foto opcional del representante
  
});

module.exports = Representante;