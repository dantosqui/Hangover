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
            const values = [province.name, province.full_name, province.latitude, province.longitude, province.display_order? province.display_order : null];
            const respuesta = await this.DBClient.query(sql, values);
            if(respuesta.rowCount === 1){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProvince(id) {
        const sql = "DELETE FROM provinces WHERE id = $1";
        const values = [id];
        const eliminado = await this.DBClient.query(sql,values);
        return eliminado;
    }

    async updateProvince(province) {
        const attributes = [];
        
        if(province.name) attributes.push(`name = '${province.name}'`);
        if(province.full_name) attributes.push(`full_name = '${province.full_name}'`);
        if(province.latitude) attributes.push(`latitude = ${province.latitude}`);
        if(province.longitude) attributes.push(`longitude = ${province.longitude}`);
        if(province.display_order) attributes.push(`display_order = ${province.display_order}`);
        var sql;
        if(attributes.length == 0){
            sql = `SELECT id from provinces WHERE id=$1`;
        }
        else{
            sql =`UPDATE provinces SET ${attributes.join(',')} WHERE id = $1`;
        }
        const values = [province.id];
        const respuesta = await this.DBClient.query(sql,values);
        console.log(respuesta.rowCount);
        return respuesta.rowCount;
        
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

    async getLocationsByProvince(limit,offset,id) {
        var sql = "SELECT id, name, id_province, latitude, longitude FROM locations WHERE id_province = $1 LIMIT $2 OFFSET $3";
        var values = [id, limit, offset*limit];
        const respuesta = await this.DBClient.query(sql, values);
        sql = `SELECT COUNT(id) FROM locations WHERE id_province = $1 GROUP BY id`;
        values=[id];
        const totalCount = await this.DBClient.query(sql, values);

        return [respuesta.rows,totalCount.rows.length];

        //falta paginacion
    }
}