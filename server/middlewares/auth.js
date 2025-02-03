const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const  User  = require('../models/User');

const authenticate = async (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader) return res.status(403).send('Access denied.');

  const token = tokenHeader.split(' ')[1]; // Eliminar "Bearer "

  try{
    console.log('Token:', token);  // Añade esta línea para ver el token
    const decoded = jwt.verify(token, 'secretKey');
    console.log('Decoded:', decoded);  // Verifica los datos decodificados
    req.user = await User.findByPk(decoded.user_id);
      next();
  }

   catch (error) {
    console.error(error);
    res.status(400).send('Invalid token.');
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Insufficient permissions.');
    next();
  };
};

module.exports = { authenticate, authorize };
