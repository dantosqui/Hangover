import express from "express";
import {EventCategoryService} from "../services/event_category-service.js";
import { EventCategory } from "../entities/event_category.js";

const router = express.Router();
const eventCategoryService = new EventCategoryService();

router.get("/", async (req, res) => {
    const limit = req.query.limit ?? null;
    const offset = req.query.offset ?? 1;

    const nextPage = req.originalUrl.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1));

    try{
        const allEventCategories = await eventCategoryService.getEvent_Category(limit, offset, nextPage);
        return res.status(200).send("ok"), json(allEventCategories);
    }catch { 
        return res.status(500).send(error);
    }
    
});

router.get("/:id", async (req, res) => {
    try {
        const event_category = await eventCategoryService.getEvent_CategoryById(req.params.id);
        if(event_category){
            return res.status(200), json(event_category);
        }
        else{
            return res.status(404);
        }
    }
    catch {
        return res.status(500).send(error);
    }
});

router.post("/", async (req, res) => {
    const event_category = new EventCategory();
    event_category = {
        name: req.body.name,
        display_order: req.body.display_order
    }

    try {
        const event_categoryCreado = await EventCategoryService.createEventCategory(event_category);
        return res.status(201);
    }
    catch {
        return res.status(400).send(error);
    }
});

router.delete("/:id", async (req, res) => {

});

export default router;