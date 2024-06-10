import { query } from "express";
import { PostRepository } from "../../repositories/post-repository.js";

export default class PostsService {
    constructor (){
        this.bd = new PostRepository();
    }

    async GetPostById(id) {
        const [post,comments] = this.bd.getPostById(id);
        return [post,comments];
    }

    async GetAllPost(limit, offset){
        const collection = this.bd.getAllPost(limit, offset);
        return collection;
    }

}