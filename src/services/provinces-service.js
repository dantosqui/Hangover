import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";
import { Pagination } from "../entities/pagination.js"

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

    async getAllProvinces(limit, offset, url){
        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [provinces,totalCount] = await this.bd.getAllProvinces(limit, offset);
        return Pagination.BuildPagination(provinces, limit, offset, url, totalCount);
    }

    async getProvinceById(id){
        const resultado = await this.bd.getProvinceById(id);
        return resultado;
    }

    async getLocationsByProvinceId(id){
        const resultado = await this.bd.getLocationsByProvince(id);
        return resultado;
    }
}