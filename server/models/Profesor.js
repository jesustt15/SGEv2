const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('profesores', {
  
  profesor_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  
});

module.exports = Profesor;