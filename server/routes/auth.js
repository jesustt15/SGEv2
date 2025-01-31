const {Router} = require('express');
const router = Router();
const { register, login, getUsers, editUser } = require('../controllers/users');




router.post('/register',  register);
  
router.post('/login', login);
  
router.get('/users', authenticate, authorize(['admin', 'user']), getUsers);
  
router.post('/users', authenticate, authorize(['admin']), async (req, res) => {
   
  });
  
router.put('/users/:id', authenticate, authorize(['admin']), editUser);