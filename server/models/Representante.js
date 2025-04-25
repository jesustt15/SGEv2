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
    validate: {
      notNull: {msg: 'El nombre es requerido.'},
      notEmpty: {msg: 'El nombre no puede estar vacío.'},
      len: [3, 30, {msg: 'El nombre debe tener entre 3 y 30 caracteres.' }],
    }
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
      len: [4, 30, {msg: 'El apellido debe tener entre 4 y 30 caracteres.' }],
    }
  },
  edo_civil: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  ced: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [7, 11,  {msg: "La cédula debe tener entre 7 y 11 dígitos." }],
    }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4,100, {msg: "La dirección debe tener entre 4 y 100 caracteres." }],
    }
  },
  telf: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [10,12, {msg: "El número de teléfono debe tener entre 10 y 12 dígitos." }],
    }
  },
  ocupacion: DataTypes.STRING,
  trabajo: DataTypes.STRING,
  dire_trabajo: DataTypes.STRING,
  telf_trabajo: DataTypes.STRING,
  correoElectronico: {
    type: DataTypes.STRING,
    validate: {
      isEmail: {msg:'Ingrese un email valido' },
    }
  },
  foto: DataTypes.STRING, // Foto opcional del representante
  
});


module.exports = Representante;