const {response} = require("express");
const Seccion = require("../models/Seccion");

const getSecciones = async(req, res = response) => {

    try {

        const secciones = await Seccion.findAll();
        res.json(secciones);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneSeccion = async(req, res = response) => {

    try {

        const seccion = await Seccion.findOne({where: {seccion_id: req.params.id}});
        if (!seccion) return res.status(404).json({ message: "Seccion not found" });
        return res.json(seccion);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearSeccion = async(req, res = response) => {

    const {nombre, nivel,seccion, docente_id} = req.body;
   
    try {

        const seccions = await Seccion.create({nombre, nivel, seccion, docente_id});
        res.status(201).json(seccions)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarSeccion = async (req, res = response) => {
    try {

      const seccion = await Seccion.findOne({
        where: { seccion_id: req.params.id }
      });
      if (!seccion) {
        return res.status(404).json({
          ok: false,
          msg: 'Seccion no encontrado'
        });
      }
  
      const [numRows, updatedRows] = await Seccion.update(req.body, {
        where: { seccion_id: req.params.id },
        returning: true  // Si tu BD lo soporta
      });
      if (numRows > 0) {
        return res.status(201).json({
          ok: true,
          data: updatedRows[0],
          msg: 'El Seccion ha sido actualizado'
        });
      } else {
        return res.status(404).json({
          ok: false,
          msg: 'No se encontró el Seccion o no se realizaron cambios'
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
  

const eliminarSeccion = async(req, res = response) => {

    try {

        const seccion = await Seccion.destroy({where: {seccion_id: req.params.id}});
        if(seccion){

           return res.status(204).json({
              ok: false,
              name: seccion.nombre,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getSecciones,
    getOneSeccion,
    eliminarSeccion,
    editarSeccion,
    crearSeccion
}