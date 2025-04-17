const {response} = require("express");
const { Estudiante, Representante, Autorizado } = require('../models');
const fs = require('fs');
const path = require('path');




const getEstudiantes = async(req, res = response) => {

    try {

        const estudiantes = await Estudiante.findAll();
        res.json(estudiantes);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneEstudiante = async (req, res = response) => {
  try {
    const estudiante = await Estudiante.findOne({
      where: { estudiante_id: req.params.id },
      include: [
        {
          model: Representante,
          as: 'representantes' // Usa el alias definido en la asociación
        },
        {
          model: Autorizado,
          as: 'autorizados'
        }
      ]
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    return res.json(estudiante);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const crearEstudiante = async (req, res = response) => {
  const {
    nombres,
    apellidos,
    fechaNacimiento,
    lugarNacimiento,
    edad,
    sexo,
    cedulaEscolar,
    condicion,
    alergias,
  } = req.body;
  const foto = req.file;
  const fotoPath = foto ? path.join('uploads', 'fotoEstudiante', foto.filename) : null;

  try {

    const estudiante = await Estudiante.create({
      nombres,
      apellidos,
      fechaNacimiento,
      lugarNacimiento,
      edad,
      sexo,
      cedulaEscolar,
      condicion,
      alergias,
      foto: fotoPath,
    });

    res.status(201).json(estudiante);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // Collect all validation error messages
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({ errors: validationErrors });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint errors separately
      const uniqueErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      res.status(400).json({ errors: uniqueErrors });
    } else {
      console.error('Error al crear estudiante:', error);
      res.status(500).json({ error: 'Error al crear estudiante' });
    }
  }
};


const editarEstudiante = async (req, res = response) => {
  try {
    const estudiante = await Estudiante.findOne({
      where: { estudiante_id: req.params.id }
    });
    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        msg: 'Estudiante no encontrado'
      });
    }

    if (req.file) {
      if (estudiante.foto) { 
        const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'fotoEstudiante', estudiante.foto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
          console.log("Foto antigua borrada:", oldPhotoPath);
        }
      }
      req.body.foto = path.join('uploads', 'fotoEstudiante', req.file.filename);
    }

    const updated = await Estudiante.update(req.body, {
      where: { estudiante_id: req.params.id }
    });

    if (updated) {
      return res.status(200).json({
        ok: true,
        msg: 'El estudiante ha sido actualizado'
      });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    } else {
      console.error("Error en editarEstudiante:", error);
      return res.status(500).json({ error });
    }
  }
};


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
    const estudiante = await Estudiante.findByPk(estudiante_id, {
      include: [{ model: Representante, as: 'representantes' }],
    });

  
      if (estudiante && representante_id) {
        await estudiante.addRepresentante(representante_id);
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

const editarSeccionEstudiante = async (req, res = response) => {
  try {
    // Asegurarnos de que la ruta defina el parámetro correctamente.
    // Por ejemplo, si la ruta es "/sge/estudiantes/:estudiante_id/edit-seccion":
    const { estudiante_id } = req.params;
    const { seccion_id } = req.body;

    const estudiantes = await Estudiante.findAll();
    const estudiante = await Estudiante.findOne({ where: { estudiante_id } });
    const updated = await estudiante.update({ seccion_id });
  

    res.status(200).json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    res.status(500).json({ error: error.message });
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
    editarSeccionEstudiante, 
    
}