import { query } from "express";
import { EventRepository } from "../../repositories/events-repository.js";

export class EventsService {
    async getEvent(offset, limit, tag, startDate, name, category, nextPage){

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if(typeof startDate !== "undefined" && regexFecha.test(startDate)){
        return false;
    }
    var mensajeCondicion = "";

    if(name){
        mensajeCondicion += ` WHERE e.name = '${name}'`;
    }

    if(category){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND ec.name = '${category}'`;
        }
        else{
            mensajeCondicion += ` WHERE ec.name = '${category}'`;
        }
    }

    if (startDate){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND e.startDate = '${startDate}'`;
        }
        else{
            mensajeCondicion += ` WHERE e.startDate = '${startDate}'`;
        }
    }

    if(tag){
        if(mensajeCondicion.includes("WHERE")){
            mensajeCondicion += ` AND t.name = '${tag}'`;
        }
        else{
            mensajeCondicion += ` WHERE t.name = '${tag}'`;
        }
    }
    console.log(mensajeCondicion);
    const bd = new EventRepository();
    const eventos = await bd.getEvent(mensajeCondicion, limit, offset);
    console.log(eventos)
    const resultado = {
        
            collection: eventos,
            pagination:
                {
                    limit: limit,
                    offset: offset,
                    nextPage: `http://localhost:3508${nextPage}`,
                    total: eventos.length
                }
            };
    return resultado;
    }

    async getEventById(id){

        const bd = new EventRepository();
        const resultado = await bd.getEventById(id);
        return resultado;
    }

    async getParticipantEvent(id, first_name, last_name, username, attended, rating){
        console.log(attended);
        if(typeof attended !== "undefined" && attended != "true" && attended != "false") {
            return false;
        }
        
        var mensajeCondicion = "";
        if(first_name){
            mensajeCondicion += ` AND u.first_name = '${first_name}'`;
        }
        
        if(last_name){
            mensajeCondicion += ` AND u.last_name = '${last_name}'`;
        }

        if(username){
            mensajeCondicion += ` AND u.username = '${username}'`;
        }

        if(attended){
            mensajeCondicion += ` AND ee.attended = ${attended}`;
        }
        if(rating){
            mensajeCondicion += ` AND ee.rating = ${rating}`;
        }
        
        const bd = new EventRepository();
        const participants = await bd.getParticipantEvent(id, mensajeCondicion);
        const resultado = {
        
            collection: participants,
            pagination:
                {
                    limit: limit,
                    offset: offset,
                    nextPage: `http://localhost:3508${nextPage}`,
                    total: eventos.length
                }
        };
        return resultado;
    }

    async createEvent(event){
        const bd = new EventRepository();
        const resultado = await bd.createEvent(event);
        if(resultado != null){
            return true;
        }
        return false;
    }

    updateEvent(id, keys, values){
        const bd = new EventsRepository();
        const resultado = bd.updateProvince(id, keys, values);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        const bd = new EventsRepository();
        const resultado = bd.deleteEvent(id);
        if(resultado){
            return true;
        }
        return false;
    }

    insertEnrollment(id_event, id_user){
        const bd = new EventsRepository();
        const resultado = bd.enrollment(id_event, id_user);
        if(resultado != null && !resultado){
            return true;
        }
        return false;
    }

    uploadUserStuff(id, id_user, description, attended, observations, rating){
        const bd = new EventsRepository();
        const resultado = bd.uploadUserStuff(id, id_user, description, attended, observations, rating);
        if(resultado != null){
            return true;
        }
        return false;
    }


}