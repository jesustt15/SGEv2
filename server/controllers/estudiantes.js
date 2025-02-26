const {response} = require("express");
const multer = require("multer");
const Estudiante = require("../models/Estudiante");
const Representante = require("../models/Representante");




// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se almacenarán las fotos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Filtro para tipos de archivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('El archivo no es una imagen válida.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


const getEstudiantes = async(req, res = response) => {

    try {

        const estudiantes = await Estudiante.findAll();
        res.json(estudiantes);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneEstudiante = async(req, res = response) => {

    try {

        const estudiante = await Estudiante.findOne({where: {estudiante_id: req.params.id}});
        if (!estudiante) return res.status(404).json({ message: "estudiante not found" });
        return res.json(estudiante);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearEstudiante = async (req, res = response) => {
  const {
    nombres,
    apellidos,
    direccionCompleta,
    telefonoResidencial,
    fechaNacimiento,
    lugarNacimiento,
    edad,
    sexo,
    cedulaEscolar,
    correoElectronico,
  } = req.body;

  try {
    // Obtener la ruta de la foto
    const fotoRuta = req.file ? req.file.path : null;

    const estudiante = await Estudiante.create({
      nombres,
      apellidos,
      direccionCompleta,
      telefonoResidencial,
      fechaNacimiento,
      lugarNacimiento,
      edad,
      sexo,
      cedulaEscolar,
      correoElectronico,
      foto: fotoRuta,
    });

    res.status(201).json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const editarEstudiante = async(req, res = response) => {

    try {

        const estudiante = await Estudiante.update(req.body ,{
           where: {estudiante_id: req.params.id}
        });

        if(estudiante){
           return res.status(201).json({
              ok: false,
              name: estudiante.nombres,
              msg: 'el estudiante ha sido actualizado'
           })
        }

     } catch (error) {

        if (error.name === 'SequelizeValidationError') {
           res.status(400).json({ error: error.message });
        }else {
           console.log(error);
           res.status(500).json({error});
        }
     }

}

const eliminarEstudiante = async(req, res = response) => {

    try {

        const estudiante = await Estudiante.destroy({where: {estudiante_id: req.params.id}});
        if(estudiante){

           return res.status(204).json({
              ok: false,
              name: estudiante.nombres,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}

const asociarEstudianteRepresentante = async(req , res = response) => {
        const {estudiante_id, representante_id} = req.body;
  
        try {
            const estudiante = await Estudiante.findByPk(estudiante_id);
            const representante = await Representante.findByPk(representante_id);
        
            if (estudiante && representante) {
              await estudiante.addRepresentante(representante);
              res.status(200).json({ message: 'Representante asociado al estudiante exitosamente.' });
            } else {
              res.status(404).json({ message: 'Estudiante o Representante no encontrados.' });
            }
          } catch (error) {
            res.status(500).json({ message: error.message })
            }
}

const getRepresentantesDeAlumno = async (req, res = response) => {
  const { id } = req.params;
  console.log(id);
  
  try {
    const estudiante = await Estudiante.findByPk(id, {
      include: [
        {
          model: Representante,
          as: 'representantes',
          through: {
            attributes: [],
          },
        },
      ],
    });
    
    if (estudiante) {
      res.status(200).json(estudiante.representantes);
    } else {
      res.status(404).json({ message: 'Estudiante no encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {

    getEstudiantes,
    getOneEstudiante,
    eliminarEstudiante,
    editarEstudiante,
    crearEstudiante,
    asociarEstudianteRepresentante,
    getRepresentantesDeAlumno, 
    
    upload
}