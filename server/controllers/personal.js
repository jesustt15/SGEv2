const {response} = require("express");
const Personal = require("../models/Personal");


const getPersonals = async(req, res = response) => {

    try {

        const personal = await Personal.findAll();
        res.json(personal);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOnePersonal = async(req, res = response) => {

    try {

        const personal = await Personal.findOne({where: {personal_id: req.params.id}});
        if (!personal) return res.status(404).json({ message: "personal not found" });
        return res.json(personal);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearPersonal = async(req, res = response) => {

    const {nombres, apellidos,ced, cod, telf, cargo} = req.body;
    console.log(req.body);
    try {

        const personal = await Personal.create({nombres, apellidos,ced, cod, telf, cargo});
        res.status(201).json(personal)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarPersonal = async(req, res = response) => {

    try {

        const personal = await Personal.update(req.body ,{
           where: {personal_id: req.params.id}
        });

        if(personal){
           return res.status(201).json({
              ok: false,
              name: personal.nombre,
              msg: 'el personal ha sido actualizado'
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

const eliminarPersonal = async(req, res = response) => {

    try {

        const personal = await Personal.destroy({where: {personal_id: req.params.id}});
        if(personal){

           return res.status(204).json({
              ok: false,
              name: personal.nombre,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getPersonals,
    getOnePersonal,
    eliminarPersonal,
    editarPersonal,
    crearPersonal
}