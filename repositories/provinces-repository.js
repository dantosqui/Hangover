import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { json } from 'express';


export class ProvinceRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async createProvince(province) {
        try {
            const sql = "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)"; 
            const values = [province.name, province.full_name, province.latitude, province.longitude, province.display_order];
            const respuesta = await this.DBClient.query(sql, values);
            if(respuesta.rows.length > 0){
                return true;
            }
            return respuesta.rows;
        } catch (error) {
            console.log(error);
        }
        
        return false;
    }

    async deleteProvince(id) {
        const sql = "DELETE FROM provinces WHERE id = $1";
        const values = [id];
        return await this.DBClient.query(sql,values);
    }

    async updateProvince(id, province) {
        const attributes = [];
        
        if(province.name) attributes.push(`name = ${province.name}`);
        if(province.full_name) attributes.push(`full_name = ${province.full_name}`);
        if(province.latitude) attributes.push(`latitude = ${province.latitude}`);
        if(province.longitude) attributes.push(`longitude = ${province.longitude}`);
        if(province.display_order) attributes.push(`id = ${province.display_order}`);

        const sql =`UPDATE provinces SET ${attributes.join(',')} WHERE id = $1`;
        const values = [id];
        return await this.DBClient.query(sql,values);
    }

    async getAllProvinces(limit, offset) {
        var sql = "SELECT * FROM provinces limit $1 offset $2";
        const values = [limit, offset*limit];
        const respuesta = await this.DBClient.query(sql, values);

    
        sql = `SELECT COUNT(id) FROM provinces GROUP BY id`;
        const totalCount = await this.DBClient.query(sql);

        return [respuesta.rows,totalCount.rows.length];
    }   

    async getProvinceById(id) {
        try {
            const sql = "SELECT * FROM provinces WHERE id = $1";
            const values = [id];
            const respuesta = await this.DBClient.query(sql, values);
            return respuesta.rows;
        }
        catch(error){
            console.log(error);
        }
    }

    async getLocationsByProvince(id) {
        const sql = "SELECT id, name, id_province, latitude, longitude FROM locations WHERE id_province = $1";
        const values = [id];
        const respuesta = await this.DBClient.query(sql, values);
        return respuesta.rows;

        //falta paginacion
    }
}