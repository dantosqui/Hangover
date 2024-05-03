import pg from 'pg';
import { DBConfig } from "./dbconfig.js";


export class UserRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getUser(username, password) {
        try {
            const query = "SELECT * FROM users WHERE username = $1 AND password = $2"; 
            const values = [`'${username}'`, `'${password}'`];
            const respuesta = await this.DBClient.query(query);
            if(respuesta.rows.length > 0){
                return respuesta.rows;
            }
        }
        catch(error){
            console.log(error);
        }
        return false;
    }

    async validateUsername(username){
        try {
            const query = "SELECT * FROM users WHERE username = $1";
            const values = [`'${username}'`];
            const respuesta = await this.DBClient.query(query, values);
            if(respuesta.rows.length = 0){
                return respuesta.rows;
            }
        }
        catch(error){
            console.log(error);
        }
        return true;
    }
}