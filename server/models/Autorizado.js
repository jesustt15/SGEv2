const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Autorizado = sequelize.define('autorizados', {
  
  autorizado_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentesco: DataTypes.STRING,
  ced: DataTypes.STRING,
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

module.exports = Autorizado;