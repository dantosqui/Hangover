import pg from 'pg';
import { DBConfig } from "./dbconfig.js";


export class UserRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getUser(username, password) {
        const query = "SELECT * FROM users WHERE username = $1 AND password = $2"; 
        const values = [`'${username}'`, `'${password}'`];
        const respuesta = await this.DBClient.query(query);
        return respuesta.rows;
    }

    async validateUsername(username){
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [`'${username}'`];
        const respuesta = await this.DBClient.query(query, values);
        return respuesta.rows;
    }
}