import express from "express";
import {UsersService} from "../services/user-service.js";
import { User } from "../entities/user.js";

const router = express.Router();
const userService = new UsersService();

router.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
        const [success, token, statusCode] = await userService.ValidateUser(username, password);
            return res.status(statusCode).send({
                success: success,
                token: token
            });  
});

router.post("/register", async (req,res)=>{
    var user = new User();
    user = {
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth,
        description: req.body.description,
        profile_photo: req.body.profile_photo,
        role_id: req.body.role_id
    }


    const [success, statusCode, message] = await userService.TryRegister(user);
    return res.status(statusCode).send({
        success: success,
        message: message
    });
    
});

router.get("/:id", async (req, res) => {
    const user = await userService.GetUserById(req.params.id);
    if(user === null){
        return res.status(404).send();
    }
    else{
        return res.status(200).json(user);
    }
});



const validarFormatoEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

export default router;