import express from "express";
import {LocationService} from "../services/location-service.js";
import { AuthMiddleware } from "../auth/authMiddleware.js";

const router = express.Router();
const locationService = new LocationService();

router.get("/", AuthMiddleware, async (req, res) => {
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? 1;

    const nextPage = req.originalUrl.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1));
    console.log(nextPage);

    try{
        const allLocations = await locationService.getLocations(offset, limit, nextPage);
        return res.status(200), json(allLocations);
    }catch { 
        return res.status(500).send(error);
    }
    
});

router.get("/:id", AuthMiddleware, async (req, res) => {
    try {
        const location = await LocationService.getLocationById(req.params.id);
        if(location){
            return res.status(200), json(location);
        }
        else{
            return res.status(404);
        }
    }
    catch {
        return res.status(500).send(error);
    }
    
});

router.get("/:id/event_location", AuthMiddleware, async (req, res) => {
    try {
        const location = await LocationService.getLocationById(req.params.id);
        if(location){
            return res.status(200), json(location);
        }
        else{
            return res.status(404);
        }
    }
    catch {
        return res.status(500).send(error);
    }
    
});


export default router;