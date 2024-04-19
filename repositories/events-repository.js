import pg from 'pg';
import { DBconfig } from "./db.js";

const client = new pg.Client(DBconfig); 
client.connect();

//const sql = "select * from events";
//const respuesta = await client.query(sql);// el await ESPERA. sirve para que no empiece a ejecutar otras cosas sin esto



export class EventRepository {
    async getEvent(mensajeCondicion, pageSize, requestedPage) {
        console.log(mensajeCondicion);
        var queryBase = "SELECT * FROM events INNER JOIN event_categories ON events.id_event_category = event_categories.id LEFT JOIN event_tags ON event_tags.id_event = events.id INNER JOIN tags ON event_tags.id_tag = tags.id" + mensajeCondicion + `limit ${pageSize} offset ${requestedPage+1}`;

        const respuesta = await client.query(queryBase);
        return respuesta.rows;
    }

    async getEventById(id) {
        const query = "SELECT * FROM events e INNER JOIN event_locations el ON e.id_event_location = el.id INNER JOIN locations l ON el.id_location = l.id WHERE e.id_event = " + id;
        const respuesta = await client.query(query);
        return respuesta.rows;
    }

    async getParticipantEvent(id, mensajeCondicion){
        const query = "SELECT u.id, u.username, u.first_name, u.last_name, ee.attended, ee. rating FROM event_enrollments ee INNER JOIN users u on ee.id_user = u.id WHERE ee.id_event = " + id + mensajeCondicion;
        const respuesta = await client.query(query);
        return respuesta.rows;
    }

    async createEvent(name, description, id_event_category, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user){
        const query = "INSERT INTO events ([name],[description],[id_event_category],[id_event_location],[start_date],[duration_in_minutes],[price],[enabled_for_enrrolment],[max_assistance],[id_creator_user]) VALUES ([ "+name+"], ["+full_name+"], ["+latitude+"], ["+longitude+"], ["+display_order+"]),"
    }

    async updateEvent(id, keys, values){
        const query = "UPDATE events SET "+keys+" = "+values+" WHERE id = "+id;
        return await client.query(query);
    }

    async deleteEvent(id){
        const query = "DELETE FROM events WHERE id = "+id;
        return await client.query(query);
    }

    async insertEnrollment(id_event, id_user){
        const existe = await client.query(("SELECT id FROM event_enrollments WHERE id_event ="+id_event+" AND id_user ="+id_user));
        const hoy = new Date();
        if(existe == null){
            const query = "INSERT INTO event_enrollments ([id_event],[id_user],[description],[registration_date_time],[attended],[observations],[rating]) VALUES (["+id_event+"],["+id_user+"],[null],["+hoy+"],[null],[null],[null])";
            return await client.query(query);
        }
        return false;
    }

    async uploadUserStuff(id_event, id_user, description, attended, observations, rating){
        const existe = await client.query(("SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event ="+id_event+" AND ee.id_user ="+id_user));
        const hoy = new Date();
        if(existe != null && existe.start_date < hoy){
            const query = "UPDATE event_enrollments SET description = "+description+", attended = "+attended+", observations = "+observations+", rating = "+rating+" WHERE id_event = "+id_event+" AND id_user = "+id_user;
            return await client.query(query);
        }
        return false;
    }
}