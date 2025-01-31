const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('users', {
  
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role:{
    type: DataTypes.ENUM('admin', 'user'),
      allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
});

module.exports = User;