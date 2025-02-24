const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Personal = sequelize.define('personals', {
  
  personal_id: {
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
  ced: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cod: DataTypes.STRING,
  telf: DataTypes.STRING,
  cargo: DataTypes.STRING
  
  
});

module.exports = Personal;