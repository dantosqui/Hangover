import pg from 'pg';
import { DBConfig } from "./dbconfig.js";

export class PurchaseRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async insertInShoppingCart(shopping_cart){
        const query = "INSERT INTO shopping_cart (post_id, user_id, quantity) VALUES ($1, $2, $3)";
        const values = [shopping_cart.postId, shopping_cart.userId, shopping_cart.quantity];

        try{
            const inserted = await this.DBClient.query(query, values);
            return inserted.rowCount > 0;
        } catch (error) {
            console.error("Error capturado:", error);

            // Devolver un código de estado 500
            res.status(500).send('Error interno del servidor');
        }
        
    }

}