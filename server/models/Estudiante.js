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
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fechaNacimiento: DataTypes.DATEONLY,
  lugarNacimiento: DataTypes.STRING,
  edad: DataTypes.INTEGER,
  sexo: DataTypes.STRING,
  direccionCompleta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefonoResidencial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  celulares: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      len: [1, 2], // Se esperan hasta 2 números de celular
    },
  },
  cedulaEscolar: DataTypes.STRING,
  correoElectronico: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },foto: DataTypes.STRING,
  
  
});

module.exports = Estudiante;