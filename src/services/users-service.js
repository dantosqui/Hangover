import { query } from "express";
import { UserRepository } from "../../repositories/users-repository.js";

export class UsersService{
    constructor() {
        this.bd = new UserRepository();
    }

    async ValidarUsuario(username, password){
        const resultado = await this.bd.getUser(username, password);
        return resultado;
    }

    async ValidarRegistro(user){
        const resultado = await this.bd.validateUsername(user);
        return resultado;
    }
}