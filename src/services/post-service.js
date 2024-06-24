import { query } from "express";
import { PostRepository } from "../../repositories/post-repository.js";

export default class PostsService {
    constructor (){
        this.bd = new PostRepository();
    }

    async GetPostById(id) {
        const post = await this.bd.getPostById(id);
        return post;
    }

    async GetCommentsPost(id, limit, page){
        const comments = await this.bd.getCommentsPost(id,limit,page);
        return comments;
    }

    async GetResponsesComment(idComment, limit, page){
        const responses = await this.bd.getResponsesComment(idComment, limit, page);
        return responses;
    }

    async GetAllPost(limit, page){
        const collection = await this.bd.getAllPost(limit, page);
        return collection;
    }

    async InsertComment(comment){
        const inserted = await this.bd.insertComment(comment);
        return inserted;
    }

}