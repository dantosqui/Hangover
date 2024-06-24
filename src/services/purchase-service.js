import { PurchaseRepository } from "../../repositories/purchase-repository.js";

export default class PostsService {
    constructor (){
        this.bd = new PostRepository();
    }

    async InsertInShoppingCart(shopping_cart){
        const inserted = await this.bd.insertInShoppingCart(shopping_cart);
        return inserted;
    }
}