import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { createToken } from "../src/auth/jwt.js";


export class UserRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getUser(username, password) {
        try {
            const query = "SELECT id FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const response = await this.DBClient.query(query, values);
            if(response.rowCount > 0){
                const token = createToken(response.rows);
                console.log(token);
                return [true, token, 200];
            }
            else{
                return [false, "", 400];
            }
        }
        catch(e){
            console.log(e);
        }
    }

    async validateRegister(user){
        try {
            let query = "SELECT * FROM users WHERE username = $1";
            let value = user.username;
            let response = await this.DBClient.query(query, value);
            if(response.rows.length == 0){
                query = "SELECT * FROM users WHERE email = $1";
                value = user.email;
                response = await this.DBClient.query(query, value);
                if(response.rows.length === 0){
                    query = "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)";
                    values = [user.first_name, user.last_name, user.username, user.password];
                    response = await this.DBClient.query(query, values);
                    return [true, 201, ""];
                }
                return [false, 400, "El email ya está registrado a otra cuenta"];             
            }
            return [false, 400, "El nombre de usuarios ya existe"];
        }
        catch(e){
            console.log(e);
        }
    }

    async getUserById(id){
        try {
            const query = "SELECT * FROM users WHERE id = $1";
            const value = id;
            const user = await this.DBClient.query(query,value);
            return user.rows;
        }
        catch(e){
            console.log(e);
        }
    }
}