const {response} = require("express");
const Autorizado = require("../models/Autorizado");
const fs = require('fs');
const path = require('path');


const getAutorizados = async(req, res = response) => {

    try {

        const autorizados = await Autorizado.findAll();
        res.json(autorizados);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneAutorizado = async(req, res = response) => {

    try {

        const autorizado = await Autorizado.findOne({where: {autorizado_id: req.params.id}});
        if (!autorizado) return res.status(404).json({ message: "autorizado not found" });
        return res.json(autorizado);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearAutorizado = async(req, res = response) => {

    const {nombre, apellido, ced, direccion, parentesco ,telf, estudiante_id} = req.body;
    const foto = req.file;
    const fotoPath = foto ? path.join('uploads', 'fotoAutorizado', foto.filename) : null;

    try {

        const autorizado = await Autorizado.create({nombre, apellido, ced, direccion, 
            parentesco ,telf, foto:fotoPath, estudiante_id});
        res.status(201).json(autorizado)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarAutorizado = async (req, res = response) => {
    try {

      const autorizado = await Autorizado.findOne({
        where: { autorizado_id: req.params.id }
      });
      if (!autorizado) {
        return res.status(404).json({
          ok: false,
          msg: 'autorizado no encontrado'
        });
      }
  
      if (req.file) {
        if (autorizado.foto) { 
          const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'fotoAutorizado', autorizado.foto);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        req.body.foto = path.join('uploads', 'fotoAutorizado', req.file.filename);
      }


      const [numRows, updatedRows] = await Autorizado.update(req.body, {
        where: { autorizado_id: req.params.id },
        returning: true  // Si tu BD lo soporta
      });
      if (numRows > 0) {
        return res.status(201).json({
          ok: true,
          data: updatedRows[0],
          msg: 'El autorizado ha sido actualizado'
        });
      } else {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró el autorizado o no se realizaron cambios'
        });
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
      } else {
        console.error(error);
        return res.status(500).json({ error });
      }
    }
  };
  

const eliminarAutorizado = async(req, res = response) => {

    try {

        const autorizado = await Autorizado.destroy({where: {autorizado_id: req.params.id}});
        if(autorizado){

           return res.status(204).json({
              ok: false,
              name: autorizado.nombre,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getAutorizados,
    getOneAutorizado,
    eliminarAutorizado,
    editarAutorizado,
    crearAutorizado
}