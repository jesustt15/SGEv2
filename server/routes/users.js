const {Router} = require('express');
const router = Router();
const { authenticate , authorize } = require('../middlewares/auth');
const { getUsers, editUser, crearUser, deleteUser, getOneUser } = require('../controllers/users');



router.get('/', getUsers);

router.get('/:id', authenticate, authorize(['admin']), getOneUser);
  
router.post('/new', crearUser);
  
router.put('/:id', authenticate, authorize(['admin']), editUser);

router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;