import express from "express";
import {ProvincesService} from "../services/provinces-service.js";

const router = express.Router();
const provinceService = new ProvincesService();

router.post("/", (req,res)=>{
    const name = req.body.name;
    const full_name = req.body.full_name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const display_order = req.body.display_order;

    if(name && full_name && latitude && longitude && display_order){
        const creacion = provinceService.createProvince(name, full_name, latitude, longitude, display_order);
        if(creacion){
            return res.status(232).send({
                valido: "provincia creada correctamente"
            });
        }
        else{
            return res.status(400).send("Error en los campos");
        }
    }
    else{
        return res.status(400).send("Error en los campos");
    }
});


router.patch( "/:id", (req,res) =>{
    const id=req.params.id;
    const body = req.body;
    if(Object.keys(body) && Object.values(body)){
        const actualizacion = provinceService.actualizarProvince(id, Object.keys(body), Object.values(body));   
        if(actualizacion){
            return res.status(232).send({
                valido: "provincia eliminada correctamente"
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", (req,res) =>{
    const id=req.params.id;
    const eliminacion = provinceService.deleteProvince(id);
    if(eliminacion){
        return res.status(232).send({
            valido: "provincia eliminada correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});