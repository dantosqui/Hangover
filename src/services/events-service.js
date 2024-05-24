import { query } from "express";
import { EventRepository } from "../../repositories/events-repository.js";
import { Pagination } from "../entities/pagination.js"

export class EventsService {
    constructor() {
        this.bd = new EventRepository();
    }

    async getEvent(offset, limit, tag, start_date, name, category, url){

        const regexFecha = /^\d{4}-\d{2}-\d{2}(?:\s\d{2}:\d{2}:\d{2})?$/;

        if(typeof start_date !== "undefined" && !regexFecha.test(start_date)){
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

        if (start_date){
            if(mensajeCondicion.includes("WHERE")){
                mensajeCondicion += ` AND e.start_date >= '${start_date}'`;
            }
            else{
                mensajeCondicion += ` WHERE e.start_date >= '${start_date}'`;
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
        
        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [eventos,totalCount] = await this.bd.getEvent(mensajeCondicion, limit, offset);
        return Pagination.BuildPagination(eventos, limit, offset, url, totalCount);
    }

    async getEventById(id){
        const resultado = await this.bd.getEventById(id);
        return resultado;
    }

    async getParticipantEvent(id, first_name, last_name, username, attended, rating, limit, offset, url){
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

        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [participants,totalCount] = await this.bd.getParticipantEvent(id, mensajeCondicion, limit, offset);
        
        return Pagination.BuildPagination(participants, limit, offset, url, totalCount);
    }

    async createEvent(event){
        const resultado = await this.bd.createEvent(event);
        if(resultado != null){
            return true;
        }
        return false;
    }

    updateEvent(id, keys, values){
        const resultado = this.bd.updateProvince(id, keys, values);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        const resultado = this.bd.deleteEvent(id);
        if(resultado){
            return true;
        }
        return false;
    }

    insertEnrollment(id_event, id_user){
        const resultado = this.bd.insertEnrollment(id_event, id_user);
        if(resultado != null && !resultado){
            return true;
        }
        return false;
    }

    uploadUserStuff(id, id_user, description, attended, observations, rating){
        const resultado = this.bd.uploadUserStuff(id, id_user, description, attended, observations, rating);
        if(resultado != null){
            return true;
        }
        return false;
    }


}