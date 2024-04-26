import express from "express";
import {EventsService} from "../services/events-service.js";


const router = express.Router();
const eventService = new EventsService();

router.get("/", async (req, res) => {
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? 1;
    const tag = req.query.tag;
    const startDate = req.query.startDate;
    const name = req.query.name;
    const category = req.query.category;

    const nextPage = req.originalUrl.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1));
    console.log(nextPage);

    try{
        const allEvents = await eventService.getEvent(offset, limit, tag, startDate, name, category, nextPage);
        //allEvents.pagination.offset = allEvents.pagination.offset +1;

        console.log("Estoy en el controller: ", allEvents)
        return res.json(allEvents);
    }catch(error){ 
        console.log("Error al buscar");
        return res.json("Un Error");
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        return res.json(event);
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/enrollment", async (req, res) => {
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const username = req.query.username;
    const attended = req.query.attended;
    const rating = req.query.rating;

    try {
        const participants = await eventService.getParticipantEvent(req.params.id, first_name, last_name, username, attended, rating);
        if(participants){
            return res.json(participants);
        }
        else{
            return res.status(400).json({ error: 'El formato de attended es inválido' });
        }
        
    }
    catch(error){
        console.log(error);
        console.log("hola");
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.post("/", async (req, res) => {
    const event = {
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
    
    if(event){
        const eventoCreado = await eventService.createEvent(event);
        if(eventoCreado){
            return res.status(232).send({
                valido: "evento creado correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.patch( "/:id", async (req,res) =>{
    const id=req.params.id;
    const body = req.body;
    if(Object.keys(body) && Object.values(body)){
        const eventoActualizado = await eventService.updateEvent(id, Object.keys(body), Object.values(body))
        if(eventoActualizado){
            return res.status(232).send({
                valido: "evento actualizado correctamente"
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", async (req,res) =>{
    const id=req.params.id;
    const eventoEliminado = await eventService.deleteEvent(id);
    if(eventoEliminado){
        return res.status(232).send({
            valido: "evento eliminado correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});

router.post("/:id/enrollment", async (req, res) => {
    const id=req.params.id;
    const description = req.query.description;
    const attended = req.query.attended;
    const observations = req.query.observations;
    const rating = req.query.rating;
    const id_user = req.body.id_user;

    if(id_user && description && attended && observations && rating){
        const eventoActualizado = await eventService.uploadUserStuff(id, id_user, description, attended, observations, rating);
        if(eventoActualizado){
            return res.status(232).send({
                valido: "usuario inscripto correctamente"
            });
        }
    }
    else if(id_user){
        const enrollmentInsertado = await eventService.insertEnrollment(id, id_user);
        if(enrollmentInsertado){
            return res.status(232).send({
                valido: "usuario inscripto correctamente"
            });
        }
    }
    return res.status(400).send("Error");
});


export default router;