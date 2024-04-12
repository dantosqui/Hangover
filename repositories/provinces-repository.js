/*import pg from 'pg';
import { DBconfig } from "./db.js";

const client = new pg.Client(DBconfig); 
client.connect();*/

/*export class ProvincesRepository {
    async createProvince(name, full_name, latitude, longitude, display_order) {
        var queryBase = "INSERT INTO provinces * ([name], [full_name], [latitude], [longitude], [display_order]) VALUES ([ "+name+"], ["+full_name+"], ["+latitude+"], ["+longitude+"], ["+display_order+"])"; 
        return await client.query(queryBase);
    }

    async deleteProvince(id) {
        var queryBase = "DELETE FROM provinces WHERE id = "+id;
        return await client.query(queryBase);
    }

    async actualizarProvince(id) {
        var queryBase = "UPDATE provinces SET name = "+name+", full_name = "+full_name+", latitude = "+latitude+", longitude = "+longitude+", display_order = "+display_order+" WHERE id = "+id;
        return await client.query(queryBase);
    }
}*/ 