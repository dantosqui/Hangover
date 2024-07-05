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
        const posts = await this.bd.getSavedLikedPosts(userId)
        return posts
    }
}