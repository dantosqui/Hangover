import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class DesignRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async get(userId, designId) {
        const sql = "SELECT image FROM designs WHERE id_creator_user = $1 AND id = $2";
        const values = [userId, designId];

        const image = (await this.DBClient.query(sql, values)).rows[0].image;
        if(image){
            return image;
        }
        else{
            return false;
        }
    }

    async save(userId, designId, image){
        let sql;
        let values;

        if(designId === undefined){
            sql = "INSERT INTO designs (last_edit, id_creator_user,parent_id,image) VALUES (CURRENT_TIMESTAMP, $1, null, $2) returning id";
            values = [userId, image];
        }
        else{
            sql = "UPDATE designs SET image = $3, last_edit = CURRENT_TIMESTAMP WHERE id_creator_user = $1 AND id = $2 returning id";
            values = [userId, designId, image];
        }
        
        const saved = (await this.DBClient.query(sql, values)).rows;
        return saved.rowCount > 0;
    }
}