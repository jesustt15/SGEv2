const {response} = require('express');
const Profesor =  require('../models/Profesor');


const getProfesores = async(req, res = response) => {

    try {

        const profesores = await Profesor.findAll();
        res.json(profesores);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneProfesor = async(req, res = response) => {

    try {

        const profesor = await Profesor.findOne({where: {profesors_id: req.params.id}});
        if (!profesor) return res.status(404).json({ message: "Profesore not found" });
        return res.json(profesor);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearProfesor = async(req, res = response) => {

    const {nombres, apellidos, cedula } = req.body;

    try {

        const profesor = await Profesor.create({nombres, apellidos , cedula});
        res.status(201).json(profesor)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarProfesor = async(req, res = response) => {

    try {

        const profesor = await Profesor.update(req.body ,{
           where: {profesor_id: req.params.id}
        });

        if(profesor){
           return res.status(201).json({
              ok: false,
              name: profesor.nombres,
              msg: 'el Profesor ha sido actualizado'
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

const eliminarProfesor = async(req, res = response) => {

    try {

        const profesor = await Profesor.destroy({where: {profesor_id: req.params.id}});
        if(profesor){

           return res.status(204).json({
              ok: false,
              name: profesor.nombres,
              msg: 'El Profesor ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getProfesores,
    getOneProfesor,
    eliminarProfesor,
    editarProfesor,
    crearProfesor
}