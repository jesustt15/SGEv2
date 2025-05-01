const {response} = require("express");
const Evento = require("../models/Evento");
const { parse, isValid } = require('date-fns'); // Import parse and isValid from date-fns
// Import fromZonedTime from date-fns-tz


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

const crearEvento = async (req, res = response) => {
    const { title, description, type, date, start_time, end_time } = req.body;
    console.log('Received body:', req.body);

    try {
        // We are logging the intended timezone assumption, but the parse function
        // seems to be handling the conversion based on system settings already.
        const localTimezone = 'America/Caracas';
        const expectedInputFormat = 'yyyy-MM-dd HH:mm:ss';

        const startString = start_time;
        const endString = end_time;

        console.log('Combined start string:', startString);
        console.log('Combined end string:', endString);
        console.log('Using format string:', expectedInputFormat);
        // Based on logs, parse seems to handle timezone conversion implicitly:
        console.log('Note: parse result appears to be UTC already based on system settings.');

        // Use parse from date-fns. According to logs, this returns the correct UTC Date object.
        const startUTC = parse(startString, expectedInputFormat, new Date());
        const endUTC = parse(endString, expectedInputFormat, new Date());

        console.log('Parsed start time (Directly used as UTC):', startUTC); // This should be the correct UTC Date object
        console.log('Parsed end time (Directly used as UTC):', endUTC);   // This should be the correct UTC Date object

        // Verify that the parsed dates are valid
        if (!isValid(startUTC) || !isValid(endUTC)) {
            console.error('Parsing failed. Check string and format.');
             return res.status(400).json({
                 error: 'Invalid date or time format received. Parsing failed.'
             });
        }

        // Create the event using the Date objects returned directly by parse
        // They are already in UTC according to your logs.
        const evento = await Evento.create({
            title,
            description,
            type,
            date, // Keep date as the YYYY-MM-DD string for DATEONLY field
            start_time: startUTC, // Pass the UTC Date object returned by parse
            end_time: endUTC      // Pass the UTC Date object returned by parse
        });

        console.log('Saved event:', evento.dataValues);
        res.status(201).json(evento);

    } catch (error) {
        console.error('Error creating event:', error);
        // Handle unique constraint error
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'Description must be unique.'
            });
        }
        // Catch other errors
        res.status(500).json({
            error: 'An error occurred while creating the event.',
            details: error.message
        });
    }
}
const editarEvento = async(req, res = response) => {

    try {

        const evento = await Evento.update(req.body ,{
           where: {evento_id: req.params.id}
        });

        if(evento){
           return res.status(201).json({
              ok: false,
              name: evento.title,
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

        const evento = await Evento.destroy({where: {evento_id: req.params.id}});
        if(evento){

           return res.status(204).json({
              ok: false,
              name: evento.title,
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