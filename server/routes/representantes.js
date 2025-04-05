const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getRepresentantes, crearRepresentante, editarRepresentante, eliminarRepresentante, getOneRepresentante } = require("../controllers/representantes");
const uploadMiddleware = require("../middlewares/uploadMiddleware")

const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getRepresentantes);
router.post('/', authenticate, authorize(['admin']) ,uploadMiddleware.uploadRepresentante.single('foto'),crearRepresentante);
router.put('/:id', authenticate, authorize(['admin']), uploadMiddleware.uploadRepresentante.single('foto'),editarRepresentante);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarRepresentante);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneRepresentante)



module.exports = router;