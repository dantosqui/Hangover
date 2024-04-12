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
        if(provinceService.createProvince(name, full_name, latitude, longitude, display_order)){
            return res.status(232).send({
                valido: "provincia creada correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});


router.patch( "/:id", (req,res) =>{
    const id=req.params.id;
    const body = req.body;
    if(Object.keys(body) && Object.values(body)){
        if(provinceService.updateProvince(id, Object.keys(body), Object.values(body))){
            return res.status(232).send({
                valido: "provincia actualizada correctamente",
            });
        }
    }
    return res.status(400).send("Error en los campos");
});

router.delete( "/:id", (req,res) =>{
    if(provinceService.deleteProvince(req.params.id)){
        return res.status(232).send({
            valido: "provincia eliminada correctamente"
        });
    }
    return res.status(400).send("Error en los campos");
});

router.get("/", (req, res) => {
    const pageSize = req.query.pageSize;
    const page = req.query.page;

    try{
        return res.json(provinceService.getAllProvinces(page, pageSize, req.url));
    }catch(error){ 
        return res.json("Un Error");
    }
});

router.get("/:id", (req, res) => {
    try {
        const province = provinceService.getProvinceById(req.params.id);
        return res.json(province);
    }
    catch(error){
        console.log("Error al buscar");
        return res.json("Un Error");
    }
});

export default router;