const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getAutorizados, crearAutorizado, editarAutorizado, eliminarAutorizado, getOneAutorizado } = require("../controllers/autorizados");
const  uploadMiddleware  = require("../middlewares/uploadMiddleware");


const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getAutorizados);
router.post('/', authenticate, authorize(['admin']) ,uploadMiddleware.uploadAutorizado.single('foto') ,crearAutorizado);
router.put('/:id', authenticate, authorize(['admin']), editarAutorizado);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarAutorizado);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneAutorizado)



module.exports = router;