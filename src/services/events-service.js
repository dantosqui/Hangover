import { query } from "express";
//import { EventRepository } from "../../repositories/events-repository.js";

export class EventsService {
    getEvent(requestedPage, pageSize, tag, startDate, name, category, url){

        //const eventRepository = new EventRepository();
        //const eventInDB = eventRepository.getAllEvents(); 
    //esto queda en la BD
    //parseo: 
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if(regexFecha.test(startDate)){
        return false;
    }

    var mensajeCondicion;

    if(name){
        mensajeCondicion += ` WHERE name = ${name}`;
    }

    if(category){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND event_categories.category = ${category}`;
        }
        else{
            mensajeCondicion += ` WHERE event_categories.category = ${category}`;
        }
    }

    if (startDate){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND startDate = ${startDate}`;
        }
        else{
            mensajeCondicion += ` WHERE startDate = ${startDate}`;
        }
    }

    if(tag){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND tags.tag = ${tag}`;
        }
        else{
            mensajeCondicion += ` WHERE tags.tag = ${tag}`;
        }
    }

    const bd = new EventRepository();
    const resultado = bd.getEvent(mensajeCondicion, pageSize, requestedPage);

    return {
        query: mensajeCondicion,
        pageSize: pageSize,
        page: requestedPage,
        nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
    };/*
        
        return {
            collection:  [{
                "id": 4,
                "name": "4 fromages",
                "prices": 12.5
            },
            {
                "id": 2,
                "name": "4 fromages",
                "prices": 24.5
            }],
            pageSize: 15,
            page: 1,
            nextPage: `http://localhost:3508/event?limit=${15}&offset=${1+1}`
        };

        //Ir a base de datos...`http://localhost:3000/${url}?limit=${pageSize}&offset=${requestedPage+1}`*/
    }

    getEventById(id){

        const bd = new EventRepository();
        const resultado = bd.getEventById(id);

        return {
            resultado: resultado
        };
    }

    getParticipantsEvent(id, first_name, last_name, userName, attended){

        if(attended || !attended) {
            return false;
        }

        var mensajeCondicion;
        if(first_name){
            mensajeCondicion += ` AND u.first_name = ${first_name}`;
        }
        
        if(last_name){
            mensajeCondicion += ` AND u.last_name = ${last_name}`;
        }

        if(userName){
            mensajeCondicion += ` AND u.username = ${userName}`;
        }

        if(attended){
            mensajeCondicion += ` AND ee.attended = ${attended}`;
        }

        if(rating){
            mensajeCondicion += ` AND ee.rating = ${rating}`;
        }
        
        const bd = new EventRepository();
        const resultado = bd.getParticipantsEvent(id, mensajeCondicion);
    }

}