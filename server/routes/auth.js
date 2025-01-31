const {Router} = require('express');
const router = Router();
const { register, login, getUsers, editUser, crearUser } = require('../controllers/users');
const { authenticate , authorize } = require('../middlewares/auth');




router.post('/register',  register);
  
router.post('/login', login);
  
router.get('/users', authenticate, authorize(['admin', 'user']), getUsers);
  
router.post('/users', authenticate, authorize(['admin']), crearUser);
  
router.put('/users/:id', authenticate, authorize(['admin']), editUser);

module.exports = router;