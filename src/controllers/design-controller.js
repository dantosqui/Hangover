import  express from "express";
import { AuthMiddleware } from "../auth/authMiddleware.js";
import DesignService from "../services/design-service.js"

const router = express.Router()
const designService = new DesignService()

router.get("/get/:id", AuthMiddleware, async (req, res) => {
    
    const user = req.user.id;
    const designId = req.params.id;
    console.log("user",user,designId)
    const design = designService.get(user, designId);
    if(design === false){
        return res.status(401).send();
    }else{
        return res.status(200).send(design);
    }
    
});

router.post("/save", AuthMiddleware, async (req, res) => {
    console.log("golaa")
    const user = req.user.id;
    const desingId = req.body.designId;
    const image = req.body.image;
    const data = req.body.designData;
    
    const saved = await designService.save(user, desingId, image,data);
    console.log(saved);
    if(saved === false){
        return res.status(401).send();
    }else{
        return res.status(200).json(image);
    }
    
});


export default router;