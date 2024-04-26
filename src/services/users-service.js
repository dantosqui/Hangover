import { query } from "express";
import { UserRepository } from "../../repositories/users-repository.js";

export class UsersService{
    async ValidarUsuario(username, password){
        const bd = new UserRepository();
        const resultado = await bd.getUser(username, password);
        if(resultado.length > 0){
            return true;
        }
        return false;
    }

    async ValidarRegistro(username){
        const bd = new UserRepository();
        const resultado = await bd.validateUsername(username);
        if(resultado.length > 0){
            return false;
        }
        return true;
    }
}