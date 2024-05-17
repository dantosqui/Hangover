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

    async ValidarRegistro(username){
        const resultado = await this.bd.validateUsername(username);
        if(resultado.length > 0){
            return false;
        }
        return true;
    }
}