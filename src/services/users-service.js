import { query } from "express";
import { UserRepository } from "../../repositories/users-repository.js";

export class UsersService{
    constructor() {
        const bd = new UserRepository();
    }

    async ValidarUsuario(username, password){
        const resultado = await bd.getUser(username, password);
        if(resultado.length > 0){
            return true;
        }
        return false;
    }

    async ValidarRegistro(username){
        const resultado = await bd.validateUsername(username);
        if(resultado.length > 0){
            return false;
        }
        return true;
    }
}