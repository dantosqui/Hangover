import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

const client = new pg.Client(DBConfig); 
client.connect();

//const sql = "select * from events";
//const respuesta = await client.query(sql);// el await ESPERA. sirve para que no empiece a ejecutar otras cosas sin esto



export class EventRepository {
    async getEvent(mensajeCondicion, limit, offset) {
        console.log(mensajeCondicion);
        var queryBase = `
        SELECT 
            e.id, 
            e.name, 
            e.description, 
            e.start_date, 
            e.duration_in_minutes, 
            e.price, 
            e.enabled_for_enrollment, 
            e.max_assistance, 
            (
                SELECT json_agg(t.name)
                FROM event_tags et
                INNER JOIN tags t ON et.id_tag = t.id
                WHERE et.id_event = e.id
            ) AS tags,
            json_build_object (
                'id', u.id,
                'username', u.username,
                'first_name', u.first_name,
                'last_name', u.last_name
            ) AS creator_user,
            json_build_object (
                'id', ec.id,
                'name', ec.name
            ) AS event_category,
            json_build_object (
                'id', el.id,
                'name', el.name,
                'full_address', el.full_address,
                'latitude', el.latitude,
                'longitude', el.longitude,
                'max_capacity', el.max_capacity
            ) AS event_location
        FROM 
            events e 
        INNER JOIN 
            event_categories ec ON e.id_event_category = ec.id 
        LEFT JOIN 
            event_tags et ON et.id_event = e.id 
        INNER JOIN 
            tags t ON et.id_tag = t.id
		INNER JOIN
			users u ON e.id_creator_user = u.id
		INNER JOIN event_locations el ON e.id_event_location = el.id
        ${mensajeCondicion} 
    `;
    if (limit !== null && limit !== undefined && limit !== 0) {
        queryBase += ` LIMIT ${limit}`;
        if (offset !== null && offset !== undefined) {
            queryBase += ` OFFSET ${offset}`;
        }
    }
    
        console.log(queryBase);
        const respuesta = await client.query(queryBase);
        return respuesta.rows;
    }

    async getEventById(id) {
        const query = "SELECT * FROM events e INNER JOIN event_locations el ON e.id_event_location = el.id INNER JOIN locations l ON el.id_location = l.id INNER JOIN provinces p ON l.id_province = p.id WHERE e.id = " + id;
        const respuesta = await client.query(query);
        return respuesta.rows;
    }

    async getParticipantEvent(id, mensajeCondicion){
        const query = `
        SELECT 
            json_build_object (
                'id', u.id,
                'username', u.username,
                'first_name', u.first_name,
                'last_name', u.last_name
            ) AS user,
            ee.attended,
            ee.rating,
            ee.description
        FROM 
            event_enrollments ee 
        INNER JOIN 
            users u on ee.id_user = u.id 
        WHERE ee.id_event = ${id} ${mensajeCondicion}
        `
        const respuesta = await client.query(query);
        return respuesta.rows;
    }

    async createEvent(event){
        const query = "INSERT INTO events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) VALUES ("+event.name+", "+event.description+", "+event.id_event_category+", "+event.id_event_location+", "+event.start_date+", "+event.duration_in_minutes+", "+event.price+", "+event.enabled_for_enrrolment+", "+event.max_assistance+", "+event.id_creator_user+")";
        return await client.query(query);
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
            const query = "INSERT INTO event_enrollments (id_event,id_user,description,registration_date_time,attended,observations,rating) VALUES ("+id_event+","+id_user+",null,"+hoy+",null,null,null)";
            return await client.query(query);
        }
        return false;
    }

    async uploadUserStuff(id_event, id_user, description, attended, observations, rating){
        const existe = await client.query(("SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event ="+id_event+" AND ee.id_user ="+id_user));
        const hoy = new Date();
        if(existe != null && existe.start_date < hoy){
            const query = "UPDATE event_enrollments SET description = '"+description+"', attended = "+attended+", observations = '"+observations+"', rating = "+rating+" WHERE id_event = "+id_event+" AND id_user = "+id_user;
            return await client.query(query);
        }
        return false;
    }
}
