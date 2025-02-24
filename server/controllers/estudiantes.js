const {response} = require("express");
const Estudiante = require("../models/Estudiante");
const Representante = require("../models/Representante");


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

const crearEstudiante = async(req, res = response) => {

    const {nombres, apellidos, telefono } = req.body;

    try {

        const estudiante = await Estudiante.create({nombres, apellidos , telefono});
        res.status(201).json(estudiante)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

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

async function asociarEstudianteRepresentante(estudiante_id, representante_id) {
    const estudiante = await Estudiante.findByPk(estudiante_id);
    const representante = await Representante.findByPk(representante_id);
  
    if (estudiante && representante) {
      await estudiante.addRepresentante(representante);
      console.log('Representante asociado al estudiante exitosamente.');
    } else {
      console.log('Estudiante o Representante no encontrados.');
    }
  }


module.exports = {

    getEstudiantes,
    getOneEstudiante,
    eliminarEstudiante,
    editarEstudiante,
    crearEstudiante,
    asociarEstudianteRepresentante
}