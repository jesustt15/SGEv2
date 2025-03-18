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
      len: [4, 30],
    }
  },
  parentesco: DataTypes.STRING,
  ced: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: {msg: 'tiene que ser numeros'},
      len: [8,10]
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4,100]
    }
  },
  telf: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [12,14]
    }
  },
  
});

module.exports = Autorizado;