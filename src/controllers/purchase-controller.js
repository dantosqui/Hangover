import  express from "express";
import {PurchaseService} from "../services/purchase-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import { Shopping_Cart } from "../entities/shopping_cart.js";

const router = express.Router()
const purchaseService = new PurchaseService()

router.post("/purchase/:idPost", AuthMiddleware, async (req,res)=> {
    const idPost = req.params.idPost;
    const quantity = req.query.quantity;

    const userId = req.user;

    const shopping_cart = new Shopping_Cart(
        null,
        idPost,
        userId, 
        quantity
    ); 

    const inserted = await purchaseService.InsertInShoppingCart(shopping_cart);

    if(inserted){
        return res.status(201).send();
    }
    else{
        return res.status(400).send();
    }
});
