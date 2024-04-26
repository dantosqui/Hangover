import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

const client = new pg.Client(DBConfig); 
client.connect();

export class ProvinceRepository {
    async createProvince(province) {
        var queryBase = "INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ("+province.name+", "+province.full_name+", "+province.latitude+", "+province.longitude+", "+province.display_order+")"; 
        const respuesta = await client.query(queryBase);
        if(respuesta != null){

        }
        return await client.query(queryBase);
    }

    async deleteProvince(id) {
        var queryBase = "DELETE FROM provinces WHERE id = "+id;
        return await client.query(queryBase);
    }

    async actualizarProvince(id, mensajeCondicion) {
        var queryBase = "UPDATE provinces "+mensajeCondicion+" WHERE id = "+id;
        return await client.query(queryBase);
    }

    async getAllProvinces(pageSize, requestedPage) {
        var queryBase = "SELECT * FROM provinces limit ="+pageSize+" offset ="+requestedPage;
        return await client.query(queryBase);
    }

    async getProvinceById(id) {
        var queryBase = "SELECT * FROM provinces WHERE id = "+id;
        return await client.query(queryBase);
    }
}