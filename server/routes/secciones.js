const {Router} = require("express");
const {authenticate, authorize} = require("../middlewares/auth");
const { getSecciones, crearSeccion, editarSeccion, eliminarSeccion, getOneSeccion } = require("../controllers/secciones");
const multer = require("multer");
const upload = multer(); 



const router = Router();



router.get('/', authenticate, authorize(['admin', 'user']) ,getSecciones);
router.post('/', authenticate, authorize(['admin'])  ,upload.none(), crearSeccion);
router.put('/:id', authenticate, authorize(['admin']),upload.none(), editarSeccion);
router.delete('/:id', authenticate, authorize(['admin']) ,eliminarSeccion);
router.get('/:id', authenticate, authorize(['admin', 'user']) ,getOneSeccion)



module.exports = router;