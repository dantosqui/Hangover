import express from "express";
import {UsersService} from "../services/users-service.js";

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
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
    const validoCampos = revisarCampos(first_name, last_name, username, password);
    if(typeof validoCampos === 'boolean'){
        if(await userService.ValidarRegistro(username)){
            return res.status(201);
        }
        else{
            return res.status(400).send("ya existe el nombre de usuario");
        }
    }
    else{
        return res.status(400).send(validoCampos);
    }
});

const revisarCampos = (first_name, last_name, username, password) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!first_name || !last_name){
        return "El nombre y apellido son obligatorios";
    }
    else if(!regex.test(username)){
        return "El formato de correo electrónico no es válido";
    }
    else if(password.length < 3){
        return "La contraseña debe tener al menos 3 caracteres";
    }
    else{
        return true;
    }
}

export default router;