const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getEstudiantes, crearEstudiante, editarEstudiante, eliminarEstudiante, getOneEstudiante } = require("../controllers/estudiantes");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getEstudiantes);
router.post('/', authenticate, authorize(['admin']) ,crearEstudiante);
router.put('/:id', authenticate, authorize(['admin']), editarEstudiante);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarEstudiante);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneEstudiante)



module.exports = router;