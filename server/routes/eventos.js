const {Router} = require('express');
const router = Router();
const { authenticate , authorize } = require('../middlewares/auth');
const { getEventos, editEvento, crearEvento, deleteEvento } = require('../controllers/users');



router.get('/', geEventos);
  
router.post('/new', crearUser);
  
router.put('/:id', authenticate, authorize(['admin']), ediEvento);

router.delete('/:id', authenticate, authorize(['admin']), deleteUser);

module.exports = router;