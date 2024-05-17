import { decryptToken } from "./jwt.js";

export function AuthMiddleware(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send("No tienes autorización");
    }
    else{
        const token = req.headers.authorization.split(' ')[1];
        const decryptedToken = decryptToken(token);
        req.user = decryptedToken;
    }

    next();
}