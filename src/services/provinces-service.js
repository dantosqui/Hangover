import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";

export class ProvincesService{
    constructor() {
        const bd = new ProvinceRepository();
    }
    
    createProvince(name, full_name, latitude, longitude, display_order){
        const resultado = bd.createProvince(name, full_name, latitude, longitude, display_order);
        if(resultado != null){
            return true;
        }
        return false;
    }

    updateProvince(id, keys, values){
        const resultado = bd.updateProvince(id, keys, values);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        return bd.deleteProvince(id);
    }

    getAllProvinces(requestedPage, pageSize, url){
        const resultado = bd.getAllProvinces();
        return {
            pageSize: pageSize,
            page: requestedPage,
            nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
        };
    }

    getProvinceById(id){
        const resultado = bd.getProvinceById(id);
        return resultado;
    }
}