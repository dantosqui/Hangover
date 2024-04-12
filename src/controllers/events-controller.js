import express from "express";
import {EventsService} from "../services/events-service.js";


const router = express.Router();
const eventService = new EventsService();

router.get("/", (req, res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;
    const tag = req.query.tag;
    const startDate = req.query.startDate;
    const name = req.query.name;
    const category = req.query.category;
    
    try{
        const allEvents = eventService.getEvent(page, pageSize, tag, startDate, name, category, req.url);
        if(allEvents){
            return res.status(400).json({ error: 'El formato de fecha es inválido' });
        }
        return res.json(allEvents);
    }catch(error){ 
        console.log("Error al buscar");
        return res.json("Un Error");
    }
    
});

router.get("/:id", (req, res) => {
    try {
        const event = eventService.getEventById(req.params.id);
        return res.json(event);
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/enrollment", (req, res) => {
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    const userName = req.query.userName;
    const attended = req.query.attended;
    const rating = req.query.rating;

    try {
        const event = eventService.getParticipantsEvent(req.params.id, first_name, last_name, userName, attended, rating);
        if(!event){
            return res.status(400).json({ error: 'El formato de attended es inválido' });
        }
        return res.json(event);
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

export default router;