const { Router } = require("express");
const { authenticate, authorize } = require("../middlewares/auth");
const {
    getEstudiantes,
    crearEstudiante,
    editarEstudiante,
    eliminarEstudiante,
    getOneEstudiante,
    asociarEstudianteRepresentante,
    getRepresentantesDeAlumno,
    editarSeccionEstudiante,
} = require("../controllers/estudiantes");
const uploadMiddleware = require('../middlewares/uploadMiddleware')
const multer = require("multer");
const upload = multer(); 
const router = Router();

// Ruta para obtener todos los estudiantes
router.get('/', authenticate, authorize(['admin', 'user']), getEstudiantes);

// Ruta para crear un estudiante
router.post('/', authenticate, authorize(['admin']), uploadMiddleware.uploadEstudiante.single('foto'), crearEstudiante);

// Ruta para asociar un representante a un estudiante
router.post('/asociar', authenticate, authorize(['admin']), asociarEstudianteRepresentante);

// Ruta para obtener los representantes de un estudiante específico
router.get('/:id/representantes', authenticate, authorize(['admin', 'user']), getRepresentantesDeAlumno);

// Rutas para editar, eliminar y obtener un estudiante específico
router.put('/:id', authenticate, authorize(['admin']),  uploadMiddleware.uploadEstudiante.single('foto') ,editarEstudiante);
router.put('/:estudiante_id/edit-seccion', authenticate, authorize(['admin']),  upload.none() ,editarSeccionEstudiante);
router.delete('/:id', authenticate, authorize(['admin']), eliminarEstudiante);
router.get('/:id', authenticate, authorize(['admin', 'user']), getOneEstudiante);

module.exports = router;
