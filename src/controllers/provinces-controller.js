import express from "express";
import {ProvincesService} from "../services/provinces-service.js";
import { Province } from "../entities/province.js";

const router = express.Router();
const provinceService = new ProvincesService();

router.post("/", async (req,res)=>{
    const province = new Province();
    province = {
        name: req.body.name,
        full_name: req.body.full_name,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        display_order: req.body.display_order
    }

    if(province){
        const provincia = await provinceService.createProvince(province);
        if(provincia){
            return res.status(232).send({
                valido: "provincia creada correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});


router.patch( "/:id", async (req,res) =>{
    const id=req.params.id;
    const body = req.body;

    const province = new Province();

    if(){
        const provincia = await provinceService.updateProvince(id, );
        if(provincia){
            return res.status(232).send({
                valido: "provincia actualizada correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", async (req,res) =>{
    const deleted = await provinceService.deleteProvince(req.params.id);
    if(deleted){
        return res.status(232).send({
            valido: "provincia eliminada correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    const offset = req.query.offset;

    try{
        const provinces = await provinceService.getAllProvinces(offset, limit, req.url);
        return res.json(provinces);
    }catch(error){ 
        return res.json("Un Error");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const province = await provinceService.getProvinceById(req.params.id);
        return res.json(province);
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

export default router;