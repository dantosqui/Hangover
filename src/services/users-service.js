import { query } from "express";

export class UsersService{
    ValidarUsuario(username, password){
        const bd = new UsersRepository();
        const resultado = bd.getUser(username, password);
        if(resultado){
            return true;
        }
        return false;
    }

    ValidarRegistro(username){
        const bd = new UsersRepository();
        const resultado = bd.validateUsername(username);
        if(resultado){
            return true;
        }
        return false;
    }
}