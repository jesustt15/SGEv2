const {response} = require("express");
const Autorizado = require("../models/index");


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

    const {nombre, apellido, ced, direccion, parentesco ,telf, foto} = req.body;

    try {

        const autorizado = await Autorizado.create({nombre, apellido, ced, direccion, parentesco ,telf, foto});
        res.status(201).json(autorizado)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarAutorizado = async(req, res = response) => {

    try {

        const autorizado = await Autorizado.update(req.body ,{
           where: {autorizado_id: req.params.id}
        });

        if(autorizado){
           return res.status(201).json({
              ok: false,
              name: autorizado.nombre,
              msg: 'el autorizado ha sido actualizado'
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