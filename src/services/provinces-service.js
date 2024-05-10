import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";

export class ProvincesService{
    constructor() {
        this.bd = new ProvinceRepository();
    }
    
    createProvince(name, full_name, latitude, longitude, display_order){
        const resultado = this.bd.createProvince(name, full_name, latitude, longitude, display_order);
        if(resultado != null){
            return true;
        }
        return false;
    }

    updateProvince(id, province){

        const resultado = this.bd.updateProvince(id, province);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        return this.bd.deleteProvince(id);
    }

    getAllProvinces(offset, limit, url){
        const resultado = this.bd.getAllProvinces();
        return {
            limit: limit,
            offset: offset,
            nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
        };
    }

    getProvinceById(id){
        const resultado = this.bd.getProvinceById(id);
        return resultado;
    }
}