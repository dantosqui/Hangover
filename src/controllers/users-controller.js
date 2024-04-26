import express from "express";
import {UsersService} from "../services/users-service.js";

const router = express.Router();
const userService = new UsersService();

router.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
        if(await userService.ValidarUsuario(username, password)){
            return res.status(232).send({
                valido: "bien ahi, existis"
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

router.post("/register", async (req,res)=>{
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const username = req.body.username;
    const password = req.body.password;
    if(first_name && last_name && username && password){
        if(await userService.ValidarRegistro(username)){
            return res.status(232).send({
                valido: "bien ahi, registrado correcto"
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