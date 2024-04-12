import express from "express";
import {UsersService} from "../services/users-service.js";

const router = express.Router();
const userService = new UsersService();

router.post("/login", (req,res)=>{
    const body = req.body;
    const camposValidos = ['username', 'password'];
    const camposRecibidos = Object.keys(body);
    if(camposValidos == camposRecibidos){
        if(userService.ValidarUsuario(body.username, body.password)){
            return res.status(232).send({
                valido: "bien ahi"
            });
        }
        else{
            return res.status(400).send("No existe el usuario");
        }
    }
    else{
        return res.status(400).send("Error en los campos");
    }
});

router.post("/register", (req,res)=>{
    const body = req.body;
    const camposValidos = ['firstName', 'lastName', 'userName', 'password'];
    const camposRecibidos = Object.keys(body);
    if(camposValidos == camposRecibidos){
        if(userService.ValidarRegistro(body.username)){
            return res.status(232).send({
                valido: "bien ahi"
            });
        }
        else{
            return res.status(400).send("ya existe el nombre de usuario");
        }
    }
    else{
        return res.status(400).send("Error en los campos");
    }
});

export default router;