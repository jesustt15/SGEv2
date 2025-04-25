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
      len: [3, 30, {msg: 'El nombre debe tener entre 4 y 30 caracteres.'}],
    }
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
      len: [3, 30, {msg: 'El apellido debe tener entre 3 y 30 caracteres.'}],
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
      len: [6,90, {msg: 'El lugar de nacimiento debe tener entre 6 y 90 caracteres.'}],
    }
  },
  edad: DataTypes.INTEGER,
  sexo: DataTypes.STRING,
  cedulaEscolar: {
   type:  DataTypes.STRING,
   unique: true,
  },
  alergias: DataTypes.STRING,
  condicion: DataTypes.STRING,
  foto: DataTypes.STRING,

  seccion_id:{
    type: DataTypes.UUID,
    allowNull: true,
  }

});



module.exports = Estudiante;