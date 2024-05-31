import express from "express";
import {EventsService} from "../services/events-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import { verificarObjeto } from "../utils/objetoVerificacion.js";

const router = express.Router();
const eventService = new EventsService();

router.get("/", AuthMiddleware, async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const tag = req.query.tag;
    const start_date = req.query.startdate;
    const name = req.query.name;
    const category = req.query.category;


    try{
        const allEvents = await eventService.getEvent(offset, limit, tag, start_date, name, category, req.originalUrl);
        if(allEvents){
            return res.json(allEvents);
        }
        else{
            return res.status(400).send();
        }
        
    }catch(error){ 
        console.log("Error al buscar");
        return res.json("Un Error");
    }
    
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if(event){
            return res.status(200).json(event);
        }
        else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/enrollment", AuthMiddleware, async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const username = req.query.username;
    const attended = req.query.attended;
    const rating = req.query.rating;
    try {
        const participants = await eventService.getParticipantEvent(req.params.id, first_name, last_name, username, attended, rating, limit, offset, req.originalUrl);
        console.log(participants);
        if(participants){
            return res.json(participants);
        }
        else{
            return res.status(400).json({ error: 'El formato de attended es inválido' });
        }
        
    }
    catch(error){
        console.log(error);
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.post("/", AuthMiddleware, async (req, res) => {
    const event = new Event();
    event = {
        name: req.body.name,
        description: req.body.description,
        id_event_category: req.body.id_event_category,
        id_event_location: req.body.id_event_location,
        start_date: req.body.start_date,
        duration_in_minutes: req.body.duration_in_minutes,
        price: req.body.price,
        enabled_for_enrollment: req.body.enabled_for_enrollment,
        max_assistance: req.body.max_assistance,
        id_creator_user: req.body.id_creator_user
    }
    
    if(verificarObjeto(event)){
        const eventoCreado = await eventService.createEvent(event);
        if(eventoCreado){
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "evento creado correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.patch( "/:id", AuthMiddleware, async (req,res) =>{
    const id=req.params.id;

    const event = new Event();
    event.name = req.body.name;
    event.description = req.body.description;
    event.id_event_category = req.body.id_event_category;
    event.id_event_location = req.body.id_event_location;
    event.start_date = req.body.start_date;
    event.duration_in_minutes = req.body.duration_in_minutes;
    event.price = req.body.price;
    event.enabled_for_enrollment = req.body.enabled_for_enrollment;
    event.max_assistance = req.body.max_assistance;
    event.id_creator_user = req.body.id_creator_user;

        const eventoActualizado = await eventService.updateEvent(id, event)
        if(eventoActualizado){
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "evento actualizado correctamente"
            });
        }
    
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", AuthMiddleware, async (req,res) =>{
    const id=req.params.id;
    const eventoEliminado = await eventService.deleteEvent(id);
    if(eventoEliminado){
        return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
            valido: "evento eliminado correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});

router.post("/:id/enrollment", AuthMiddleware, async (req, res) => {
    const id=req.params.id;
    const description = req.query.description;
    const attended = req.query.attended;
    const observations = req.query.observations;
    const rating = req.query.rating;
    const id_user = req.body.id_user;

    if(id_user && description && attended && observations && rating){
        const eventoActualizado = await eventService.uploadUserStuff(id, id_user, description, attended, observations, rating);
        if(eventoActualizado){
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "enrollment actualizado correctamente"
            });
        }
    }
    else if(id_user){
        const enrollmentInsertado = await eventService.insertEnrollment(id, id_user);
        if(enrollmentInsertado){
            return res.status(232).send({//Los códigos de estado 227 a 299 no están asignados actualmente.
                valido: "usuario inscripto correctamente"
            });
        }
    }
    return res.status(400).send("Error");
});


export default router;