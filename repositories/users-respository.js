import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

const client = new pg.Client(DBConfig); 
client.connect();

export class UserRepository {
    async getUser(username, password) {
        var query = "SELECT * FROM users WHERE username = "+username+" AND password = "+password; 
        return await client.query(query);
    }

    async validateUsername(username){
        var query = "SELECT * FROM users WHERE username = "+username;
        return await client.query(query);
    }
}