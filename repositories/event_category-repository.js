import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class EventCategoryRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }
}