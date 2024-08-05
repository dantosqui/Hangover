import { query } from "express";
import { UserRepository } from "../../repositories/users-repository.js";

export class UsersService{
    constructor() {
        this.bd = new UserRepository();
    }

    async ValidateUser(username, password){
        const [success, token, statusCode] = await this.bd.getUser(username, password);
        return [success, token, statusCode];
    }

    async TryRegister(user){
        const [success, statusCode, message] = await this.bd.validateRegister(user);
        return [success, statusCode, message];
    }

    async GetUserById(id){
        const user = await this.bd.getUserById(id);
        return user;
    }

    async getSavedLikedPosts(userId){
        const posts = await this.bd.getSavedLikedPosts(userId);
        return posts;
    }

    async getTotalUserInfo(ownUser, userId){
        const info = await this.bd.getTotalUserInfo(ownUser, userId);
        return info;
    }
    async postFollow(ownId,followId) {
        const inserted = await this.bd.insertFollow(ownId,followId)
        return inserted
    }
    async deleteFollow(ownId,followId){
        const inserted = await this.bd.deleteFollow(ownId,followId)
        return inserted
    }
}


