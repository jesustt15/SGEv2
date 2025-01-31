const { Sequelize } = require('sequelize');
require('dotenv').config();

const {DB_PASS , DB_NAME, DB_HOST, DB_USER} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  define: {
    timestamps: false // evita que se añadan columnas de timestamp automáticamente
  }
});

module.exports = sequelize;