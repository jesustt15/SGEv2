const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getPersonals, crearPersonal, editarPersonal, eliminarPersonal, getOnePersonal } = require("../controllers/personal");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getPersonals);
router.post('/', authenticate, authorize(['admin']) ,crearPersonal);
router.put('/:id', authenticate, authorize(['admin']), editarPersonal);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarPersonal);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOnePersonal);



module.exports = router;