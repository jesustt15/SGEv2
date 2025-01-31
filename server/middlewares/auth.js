const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied.');

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
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
