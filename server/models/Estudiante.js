const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Estudiante = sequelize.define('estudiantes', {
  
  estudiante_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El nombre es requerido.'},
      notEmpty: {msg: 'El nombre no puede estar vacío.'},
      len: [4, 30],
    }
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
      len: [3, 30],
    }
  },
  fechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {msg: 'Debe ingresar una fecha'}
    }
  },
  lugarNacimiento: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [6,90]
    }
  },
  edad: DataTypes.INTEGER,
  sexo: DataTypes.STRING,
  direccionCompleta: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telefonoResidencial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cedulaEscolar: {
   type:  DataTypes.STRING,
   unique: true,
  validate: {
    isAlphanumeric: {msg: 'Tiene que ser alfanumeirco'}
  }
  },
  foto: DataTypes.STRING,
  
  
});


module.exports = Estudiante;