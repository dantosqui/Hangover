                                                                                                                                                                    import express from "express";
import {UsersService} from "../services/user-service.js";
import { User } from "../entities/user.js";
import { body, validationResult } from 'express-validator';

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

const validateUserFields = [
    body('username').notEmpty(),
    body('first_name').notEmpty(),
    body('last_name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('date_of_birth').isDate(),
    body('description').optional(),
    body('profile_photo').optional(),
    body('role_id').isInt({ min: 1 }),
];

router.post("/register", validateUserFields, async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), mensaje: "campos no son correctos" });
    }

    const user = new User(
        null,
        req.body.username,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password,
        req.body.date_of_birth,
        req.body.description,
        req.body.profile_photo,
        req.body.role_id
    );

    checkBirthDate(user.date_of_birth);

    const [success, statusCode, message] = await userService.TryRegister(user);
    return res.status(statusCode).send({
        success: success,
        message: message
    });
    
});

const checkBirthDate = (date) => {
    const today = new Date();
    const birthDate = new Date(user.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if monthDiff is negative (not yet birthday this year)
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if(age < 13){
        return res.status(400).send("Debe ser mayor de 13 años");
    }
}

router.get("/:id", async (req, res) => {
    const user = await userService.GetUserById(req.params.id);
    if(user === null){
        return res.status(404).send("No existe el usuario");
    }
    else{
        return res.status(200).json(user);
    }
});

export default router;