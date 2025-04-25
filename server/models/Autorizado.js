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
    validate: {
      notNull: {msg: 'El nombre es requerido.'},
      notEmpty: {msg: 'El nombre no puede estar vacío.'},
      len: [4, 30],
    }
  },
  apellido:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
      len: [4, 30, {msg: 'El nombre debe tener entre 4 y 30 caracteres.'}],
    }
  },
  parentesco: DataTypes.STRING,
  ced: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [7,11, {msg: 'La cédula debe tener entre 7 y 11 números.'}],
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4,100, {msg: 'La dirección debe tener entre 4 y 100 caracteres.'}],
    }
  },
  observaciones: DataTypes.STRING,
  telf: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10,13, {msg: 'El teléfono debe tener entre 10 y 13 numeros.'}],
    }
  },
  foto: DataTypes.STRING,
  
});

module.exports = Autorizado;