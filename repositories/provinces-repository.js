import pg from 'pg';
import { DBconfig } from "./db.js";

const client = new pg.Client(DBconfig); 
client.connect();

export class ProvincesRepository {
    async createProvince(name, full_name, latitude, longitude, display_order) {
        var queryBase = "INSERT INTO provinces ([name], [full_name], [latitude], [longitude], [display_order]) VALUES ([ "+name+"], ["+full_name+"], ["+latitude+"], ["+longitude+"], ["+display_order+"])"; 
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
        var queryBase = "SELECT * FROM provinces limit "+pageSize+" offset "+requestedPage;
        return await client.query(queryBase);
    }

    async getProvinceById(id) {
        var queryBase = "SELECT * FROM provinces WHERE id = "+id;
        return await client.query(queryBase);
    }
}