/*import pg from 'pg';
import { DBconfig } from "./db.js";

const client = new pg.Client(DBconfig); 
client.connect();

//const sql = "select * from events";
//const respuesta = await client.query(sql);// el await ESPERA. sirve para que no empiece a ejecutar otras cosas sin esto



export class EventRepository {
    async getAllEvents() {
        const sql = `select * from events limit ${pageSize} offset ${requestedPage}`;
        const respuesta = await client.query(sql);
        return respuesta.rows;
    }
}*/