const {response} = require("express");
const Evento = require("../models/Evento");


const getEventos = async(req, res = response) => {

    try {

        const eventos = await Evento.findAll();
        res.json(eventos);
        
    } catch (error) {
        
        res.status(500).json({error: error.message});
    }

}

const getOneEvento = async(req, res = response) => {

    try {

        const evento = await Evento.findOne({where: {evento_id: req.params.id}});
        if (!evento) return res.status(404).json({ message: "Evento not found" });
        return res.json(evento);

      } catch (error) {

        return res.status(500).json({ message: error.message });
      }

}

const crearEvento = async(req, res = response) => {

    const {title, description, type, date} = req.body;
    console.log(req.body);
    try {

        const evento = await Evento.create({title, description, type, date});
        res.status(201).json(evento)
        
    } catch (error) {

        res.status(400).json({error: error.message})   
    }

}

const editarEvento = async(req, res = response) => {

    try {

        const Evento = await Evento.update(req.body ,{
           where: {Evento_id: req.params.id}
        });

        if(Evento){
           return res.status(201).json({
              ok: false,
              name: Evento.nombre,
              msg: 'el Evento ha sido actualizado'
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

const eliminarEvento = async(req, res = response) => {

    try {

        const Evento = await Evento.destroy({where: {Evento_id: req.params.id}});
        if(Evento){

           return res.status(204).json({
              ok: false,
              name: Evento.nombre,
              msg: 'El estudiante ha sido eliminado'
           })
        }
     } catch (error) {
        
        console.log(error);
        res.status(500).json({error});
     }
  

}


module.exports = {

    getEventos,
    getOneEvento,
    eliminarEvento,
    editarEvento,
    crearEvento
}