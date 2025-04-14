const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seccion = sequelize.define('secciones', {
  
  seccion_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {msg: 'El nombre es requerido.'},
      notEmpty: {msg: 'El nombre no puede estar vacío.'},
    }
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {msg: 'El apellido es requerido.'},
      notEmpty: {msg: 'El apellido no puede estar vacío.'},
    }
  },
  docente_id: {
    type: DataTypes.UUIDV4,
    allowNull:false,
  }
   
});


module.exports = Seccion;