const {Router} = require('express');
const router = Router();
const { authenticate , authorize } = require('../middlewares/auth');
const { getEventos, crearEvento, editarEvento, eliminarEvento } = require('../controllers/eventos');



router.get('/', getEventos);
  
router.post('/new', crearEvento);
  
router.put('/:id', authenticate, authorize(['admin']), editarEvento);

router.delete('/:id', authenticate, authorize(['admin']), eliminarEvento);

module.exports = router;