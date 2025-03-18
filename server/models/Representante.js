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
      len: [4, 30],
    }
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
      len: [4, 30],
    }
  },
  edo_civil: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  ced: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isNumeric:{msg: 'tienen que ser numeros'},
      len: [4,9]
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
    allowNull: true,
    validate: {
      len: [12,14]
    }
  },
  ocupacion: DataTypes.STRING,
  trabajo: DataTypes.BOOLEAN,
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