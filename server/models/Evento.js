const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('eventos', {
  
  evento_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('escolar', 'administrativo'),
    allowNull: false,
  },
  
});

module.exports = Evento;