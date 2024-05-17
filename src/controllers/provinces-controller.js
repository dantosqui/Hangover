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

    const province = new Province();
    province.name = req.body.name;
    province.full_name = req.body.full_name;
    province.latitude = req.body.latitude;
    province.longitude = req.body.longitude;
    province.display_order = req.body.display_order

        const provincia = await provinceService.updateProvince(id, province);
        if(provincia){
            return res.status(232).send({
                valido: "provincia actualizada correctamente",
            });
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
        const provinces = await provinceService.getAllProvinces(limit, offset, req.originalUrl);
        return res.status(200).json(provinces);
    }catch(error){ 
        return res.json("Un Error");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const province = await provinceService.getProvinceById(req.params.id);
        if(province.length > 0){
            return res.status(200).json(province);
        }else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

router.get("/:id/locations", async (req, res) => {
    try {
        const locations = await provinceService.getLocationsByProvinceId(req.params.id);
        if(locations.length > 0){
            return res.status(200).json(locations);
        }else{
            return res.status(404).send();
        }
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

export default router;