import { decryptToken } from "./jwt.js";

export function AuthMiddleware(req, res, next){
    console.log("a:", req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        req.user = null;
    }
    else{
        const decryptedToken = decryptToken(token);
        req.user = decryptedToken;
    }

    next();
}