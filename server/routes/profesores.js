const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getProfesores, crearProfesor, editarProfesor, eliminarProfesor, getOneProfesor } = require("../controllers/profesores");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getProfesores);
router.post('/', authenticate, authorize(['admin']) ,crearProfesor);
router.put('/:id', authenticate, authorize(['admin']), editarProfesor);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarProfesor);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneProfesor);



module.exports = router;