import { query } from "express";
import { PostRepository } from "../../repositories/post-repository.js";

export default class PostsService {
    constructor (){
        this.bd = new PostRepository();
    }

    async GetPostById(id) {
        const [post,comments] = await this.bd.getPostById(id);
        console.log("hola");
        return [post,comments];
    }

    async GetAllPost(limit, offset){
        const collection = await this.bd.getAllPost(limit, offset);
        return collection;
    }

}