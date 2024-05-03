import pg from 'pg';
import { DBConfig } from "./dbconfig.js";


export class EventRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getEvent(mensajeCondicion, limit, offset) {
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
        queryBase += ` LIMIT = $1`;
        values = [limit];
        if (offset !== null && offset !== undefined) {
            queryBase += ` OFFSET = $2`;
            values = [limit, offset];
        }
        const respuesta = await this.DBClient.query(queryBase, values);
    }  
    else{
        const respuesta = await this.DBClient.query(queryBase);
    }
        

        queryBase = `SELECT COUNT(id) FROM events ${mensajeCondicion} GROUP BY id`;

        const totalCount = await this.DBClient.query(queryBase);
        console.log(totalCount);
        return [respuesta.rows,totalCount.rows.length];
    }

    async getEventById(id) {
        const query = "SELECT * FROM events e INNER JOIN event_locations el ON e.id_event_location = el.id INNER JOIN locations l ON el.id_location = l.id INNER JOIN provinces p ON l.id_province = p.id WHERE e.id = $1";
        const values = [id];
        const respuesta = await this.DBClient.query(query, values);
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
        WHERE ee.id_event = $1 ${mensajeCondicion}
        `
        const values = [id];
        const respuesta = await this.DBClient.query(query, values);
        return respuesta.rows;
    }

    async createEvent(event){
        const query = "INSERT INTO events (name,description,id_event_category,id_event_location,start_date,duration_in_minutes,price,enabled_for_enrollment,max_assistance,id_creator_user) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
        const values = [event.name, event.description, event.id_event_category, event.id_event_location, event.start_date, event.duration_in_minutes, event.price, event.enabled_for_enrrolment, event.max_assistance, event.id_creator_user];
        return await this.DBClient.query(query, values);
    }

    async updateEvent(id, keys, values){
        const query = "UPDATE events SET "+keys+" = "+values+" WHERE id = "+id;
        return await this.DBClient.query(query);
    }

    async deleteEvent(id){
        const query = "DELETE FROM events WHERE id = $1";
        const values = [id];
        return await this.DBClient.query(query, values);
    }

    async insertEnrollment(id_event, id_user){
        const existe = await this.DBClient.query(("SELECT id FROM event_enrollments WHERE id_event = $1 AND id_user = $2"), [id_event, id_user]);
        if(existe == null){
            const sql = "INSERT INTO event_enrollments (id_event,id_user,description,registration_date_time,attended,observations,rating) VALUES ($1,$2,null,CURRENT_TIMESTAMP,null,null,null)";
            const values = [id_event, id_user];
            return await this.DBClient.query(sql, values);
        }
        return false;
    }

    async uploadUserStuff(id_event, id_user, description, attended, observations, rating){
        const existe = await this.DBClient.query(("SELECT ee.id, e.start_date FROM event_enrollments ee INNER JOIN events e ON ee.id_event = e.id_event WHERE ee.id_event = $1 AND ee.id_user = $2"), values[id_event, id_user]);
        const hoy = new Date();
        if(existe != null && existe.start_date < hoy){
            const sql = "UPDATE event_enrollments SET description = $1, attended = $2, observations = $3, rating = $4 WHERE id_event = $5 AND id_user = $6";
            const values = [description, attended, observations, rating, id_event, id_user];
            return await this.DBClient.query(sql,values);
        }
        return false;
    }
}
