import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";
import { Pagination } from "../entities/pagination.js"

export class ProvincesService{
    constructor() {
        this.bd = new ProvinceRepository();
    }
    
    createProvince(province){
        console.log(province);
        console.log(province.latitude);
        if(province.name.length <= 3 || isNaN(province.latitude) || isNaN(province.longitude)){
            return false;
        }
        else{
            const resultado = this.bd.createProvince(province);
            return resultado;
        }
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

    async getLocationsByProvinceId(limit, offset, url, id){
        limit = Pagination.ParseLimit(limit);
        offset = Pagination.ParseOffset(offset);
        const [locations,totalCount] = await this.bd.getLocationsByProvince(limit, offset, id);
        return Pagination.BuildPagination(locations, limit, offset, url, totalCount);
    }
}