const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getPersonals, crearPersonal, editarPersonal, eliminarPersonal, getOnePersonal } = require("../controllers/personal");
const uploadMiddleware = require("../middlewares/uploadMiddleware");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getPersonals);
router.post('/', authenticate, authorize(['admin']) , uploadMiddleware.uploadPersonal.single('foto') ,crearPersonal);
router.put('/:id', authenticate, authorize(['admin']),uploadMiddleware.uploadPersonal.single('foto') ,editarPersonal);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarPersonal);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOnePersonal);



module.exports = router;