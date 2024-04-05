import { query } from "express";
//import { EventRepository } from "../../repositories/events-repository.js";

export class EventsService {
    getEvent(requestedPage, pageSize, tag, startDate, name, category, url){

        //const eventRepository = new EventRepository();
        //const eventInDB = eventRepository.getAllEvents(); 
    //esto queda en la BD
    //parseo: 

    var queryBase = "SELECT * FROM events";
        
    if(name){
        queryBase += ` WHERE name = ${name}`;
    }

    if(category){
        queryBase += "INNER JOIN event_categories ON event.id_event_category = event_categories.id";
        if(queryBase.includes("WHERE")){
            queryBase += ` AND event_categories.category = ${category}`;
        }
        else{
            queryBase += ` WHERE event_categories.category = ${category}`;
        }
    }

    if (startDate){
        if(queryBase.includes("WHERE")){
            queryBase += ` AND startDate = ${startDate}`;
        }
        else{
            queryBase += ` WHERE startDate = ${startDate}`;
        }
    }

    if(tag){
        queryBase += "INNER JOIN event_tags ON event_tags.id_event = event.id INNER JOIN tags ON event_tags.id_tag = tags.id";
        if(queryBase.includes("WHERE")){
            queryBase += ` AND tags.tag = ${tag}`;
        }
        else{
            queryBase += ` WHERE tags.tag = ${tag}`;
        }
    }


    return {
        query: queryBase,
        pageSize: pageSize,
        page: requestedPage,
        nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
    };

    /*Client.execute(queryBase);
        
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
        const query = "SELECT * FROM events e INNER JOIN event_locations el ON e.id_event_location = el.id INNER JOIN locations l ON el.id_location = l.id WHERE e.id_event = " + id;

        /*Client.execute(queryBase);*/

        return {
            query: query
        };
    }

    getParticipantsEvent(id, first_name, last_name, userName, attended){
        const query = "SELECT * FROM "
    }

}