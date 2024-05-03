import pg from 'pg';
import { DBConfig } from "./dbconfig.js";


export class ProvinceRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async createProvince(province) {
        const sql = "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)"; 
        const values = [province.name, province.full_name, province.latitude, province.longitude, province.display_order];
        const respuesta = await this.DBClient.query(sql, values);
        return respuesta.rows;
    }

    async deleteProvince(id) {
        const sql = "DELETE FROM provinces WHERE id = $1";
        const values = [id];
        return await this.DBClient.query(sql,values);
    }

    async actualizarProvince(id, keys, values) {
        const sql = "UPDATE provinces "+mensajeCondicion+" WHERE id = $1";
        const values = values;
        return await this.DBClient.query(sql,values);
    }

    async getAllProvinces(pageSize, requestedPage) {
        const sql = "SELECT * FROM provinces limit = $1 offset = $2";
        const values = [pageSize, requestedPage];
        return await this.DBClient.query(sql, values);
    }

    async getProvinceById(id) {
        const sql = "SELECT * FROM provinces WHERE id = $1";
        const values = [id];
        
        return await this.DBClient.query(sql,values);
    }
}