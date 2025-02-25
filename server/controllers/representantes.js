const {response} = require("express");
const Representante = require("../models/Representante");


const getRepresentantes = async(req, res = response) => {

    try {

        const repres = await Representante.findAll();
        res.json(repres);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneRepresentante = async(req, res = response) => {

    try {

        const representante = await Representante.findOne({where: {representante_id: req.params.id}});
        if (!representante) return res.status(404).json({ message: "representante not found" });
        return res.json(representante);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearRepresentante = async(req, res = response) => {

    const {tipo, nombre, apellido, edo_civil, edad, ced,telf,
            direccion, ocupacion, trabajo, dire_trabajo, telf_trabajo, foto
    } = req.body;

    try {

        const representante = await Representante.create({tipo, nombre, apellido, edo_civil, edad, ced,telf,
            direccion, ocupacion, trabajo, dire_trabajo, telf_trabajo, foto});
        res.status(201).json(representante)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarRepresentante = async(req, res = response) => {

    try {

        const representante = await Representante.update(req.body ,{
           where: {representante_id: req.params.id}
        });

        if(representante){
           return res.status(201).json({
              ok: false,
              name: representante.nombre,
              msg: 'el representante ha sido actualizado'
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

const eliminarRepresentante = async(req, res = response) => {

    try {

        const representante = await Representante.destroy({where: {representante_id: req.params.id}});
        if(representante){

           return res.status(204).json({
              ok: false,
              name: representante.nombre,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getRepresentantes,
    getOneRepresentante,
    eliminarRepresentante,
    editarRepresentante,
    crearRepresentante
}