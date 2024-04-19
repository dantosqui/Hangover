import express from "express";
import {EventsService} from "../services/events-service.js";


const router = express.Router();
const eventService = new EventsService();

router.get("/", async (req, res) => {
    const limit = req.query.limit ?? 0;
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
    const userName = req.query.userName;
    const attended = req.query.attended;
    const rating = req.query.rating;

    try {
        const participants = await eventService.getParticipantsEvent(req.params.id, first_name, last_name, userName, attended, rating);
        if(!participants){
            return res.status(400).json({ error: 'El formato de attended es inválido' });
        }

        return res.json(participants);
    }
    catch(error){
        console.log(first_name);
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.post("/", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const id_event_category = req.body.id_event_category;
    const id_event_location = req.body.id_event_location;
    const start_date = req.body.start_date;
    const duration_in_minutes = req.body.duration_in_minutes;
    const price = req.body.price;
    const enabled_for_enrollment = req.body.enabled_for_enrollment;
    const max_assistance = req.body.max_assistance;
    const id_creator_user = req.body.id_creator_user;
    
    if(name && description && id_event_category && id_event_location && start_date && duration_in_minutes && price && enabled_for_enrollment && max_assistance && id_creator_user){
        if(eventService.createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user)){
            return res.status(232).send({
                valido: "evento creado correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.patch( "/:id", (req,res) =>{
    const id=req.params.id;
    const body = req.body;
    if(Object.keys(body) && Object.values(body)){
        if(eventService.updateEvent(id, Object.keys(body), Object.values(body))){
            return res.status(232).send({
                valido: "evento actualizado correctamente"
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", (req,res) =>{
    const id=req.params.id;
    if(eventService.deleteEvent(id)){
        return res.status(232).send({
            valido: "evento eliminado correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});

router.post("/:id/enrollment", (req, res) => {
    const id=req.params.id;
    const description = req.query.description;
    const attended = req.query.attended;
    const observations = req.query.observations;
    const rating = req.query.rating;
    const id_user = req.body.id_user;

    if(id_user && description && attended && observations && rating){
        if(eventService.uploadUserStuff(id, id_user, description, attended, observations, rating)){
            return res.status(232).send({
                valido: "usuario inscripto correctamente"
            });
        }
    }
    else if(id_user){
        if(eventService.insertEnrollment(id, id_user)){
            return res.status(232).send({
                valido: "usuario inscripto correctamente"
            });
        }
    }
    return res.status(400).send("Error");
});


export default router;