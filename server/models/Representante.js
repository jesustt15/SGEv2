const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estudiante = require('./Estudiante');

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
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  edo_civil: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  ced: DataTypes.STRING,
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ocupacion: DataTypes.STRING,
  trabajo: DataTypes.BOOLEAN,
  dire_trabajo: DataTypes.STRING,
  telf_trabajo: DataTypes.STRING,
  foto: DataTypes.STRING, // Foto opcional del representante
  
});


module.exports = Representante;