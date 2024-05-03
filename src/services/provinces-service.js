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

    updateProvince(id, province){

        const resultado = bd.updateProvince(id, province);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        return bd.deleteProvince(id);
    }

    getAllProvinces(offset, limit, url){
        const resultado = bd.getAllProvinces();
        return {
            limit: limit,
            offset: offset,
            nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
        };
    }

    getProvinceById(id){
        const resultado = bd.getProvinceById(id);
        return resultado;
    }
}