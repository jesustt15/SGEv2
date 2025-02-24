const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Autorizado = sequelize.define('autorizados', {
  
  autorizado_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  apellidosNombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentesco: DataTypes.STRING,
  cedulaIdentidad: DataTypes.STRING,
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefonos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

module.exports = Autorizado;