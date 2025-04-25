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
    type: DataTypes.STRING,
    allowNull: false,
  },
  cod: DataTypes.STRING,
  telf:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10,13, {msg: "El número de teléfono debe tener entre 10 y 13 dígitos." }],
    }
  }, 
  cargo:{
    type: DataTypes.ENUM('Director(a)', 'Sub Director(a)','Coordinador(a) Pedagogia'
      , 'Docente', 'Vigilante', 'Secretaria', 'Obrero(a)', 'Cocinero(a)'),
      allowNull: false,
  } ,
  foto: DataTypes.STRING,
  
  
});

module.exports = Personal;