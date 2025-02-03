const {Router} = require('express');
const router = Router();
const { authenticate , authorize } = require('../middlewares/auth');
const { getUsers, editUser, crearUser } = require('../controllers/users');



router.get('/', authenticate, authorize(['admin', 'user']), getUsers);
  
router.post('/new', authenticate, authorize(['admin']), crearUser);
  
router.put('/users/:id', authenticate, authorize(['admin']), editUser);

module.exports = router;