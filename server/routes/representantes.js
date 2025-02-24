const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getRepresentantes, crearRepresentante, editarRepresentante, eliminarRepresentante, getOneRepresentante } = require("../controllers/representantes");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getRepresentantes);
router.post('/', authenticate, authorize(['admin']) ,crearRepresentante);
router.put('/:id', authenticate, authorize(['admin']), editarRepresentante);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarRepresentante);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneRepresentante)



module.exports = router;