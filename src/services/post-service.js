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

    async GetAllPost(limit, page, userId){
        const collection = await this.bd.getAllPost(limit, page, userId);
        return collection;
    }

    async InsertComment(comment){
        const inserted = await this.bd.insertComment(comment);
        return inserted;
    }

    async InsertCommentLikes(like){
        const inserted = await this.bd.insertCommentLikes(like);
        return inserted;
    }

    async DeleteCommentLikes(like){
        const deleted = await this.bd.deleteCommentLikes(like);
        return deleted;
    }

    async InsertLiked(like){
        const inserted = await this.bd.insertLiked(like);
        return inserted;
    }

    async DeleteLiked(like){
        const deleted = await this.bd.deleteLiked(like);
        return deleted;
    }

    async InsertSaved(saved){
        const inserted = await this.bd.insertSaved(saved);
        return inserted;
    }

    async DeleteSaved(saved){
        const deleted = await this.bd.deleteSaved(saved);
        return saved;
    }

}