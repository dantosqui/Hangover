import  express from "express";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import DesignService from "../services/design-service.js"

const router = express.Router()
const designService = new DesignService()

router.get("/get/:id", AuthMiddleware, async (req, res) => {
    const user = req.user.id;
    const desingId = req.params.id;

    const image = designService.get(user, desingId);
    if(image === false){
        return res.status(401).send();
    }else{
        return res.status(200).json(image);
    }
    
});

router.post("/save", AuthMiddleware, async (req, res) => {
    console.log("golaa")
    const user = req.user.id;
    const desingId = req.body.designId;
    const image = req.body.image;

    const saved = await designService.save(user, desingId, image);
    if(saved === false){
        return res.status(401).send();
    }else{
        return res.status(200).json(image);
    }
    
});

export default router;