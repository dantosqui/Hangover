import express from "express";
import {UsersService} from "../services/users-service.js";
import { User } from "../entities/user.js";

const router = express.Router();
const userService = new UsersService();

router.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        const token = await userService.ValidarUsuario(username, password);
        if(token){
            return res.status(200).send({
                success: true,
                message: "Usuario encontrado",
                token: token
            });
        }
        else{
            return res.status(401).send({
                success: false,
                message: "Usuario o clave inválida",
                token: ""
            });
        }
    }
    else{
        return res.status(400);
    }
});

router.post("/register", async (req,res)=>{
    var user = new User();
    user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password
    }

    const validoCampos = revisarCampos(user);
    if(typeof validoCampos === 'boolean'){
        const respuesta = await userService.ValidarRegistro(user);
        if(respuesta){
            return res.status(201).send();
        }
        else{
            return res.status(400).send("ya existe el nombre de usuario");
        }
    }
    else{
        return res.status(400).send(validoCampos);
    }
});

const revisarCampos = (user) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!user.first_name || !user.last_name){
        return "El nombre y apellido son obligatorios";
    }
    else if(!regex.test(user.username)){
        return "El formato de correo electrónico no es válido";
    }
    else if(user.password.length < 3){
        return "La contraseña debe tener al menos 3 caracteres";
    }
    else{
        return true;
    }
}

export default router;