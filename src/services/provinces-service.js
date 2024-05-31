import { query } from "express";
import { ProvinceRepository } from "../../repositories/provinces-repository.js";
import { Pagination } from "../entities/pagination.js"

export class ProvincesService{
    constructor() {
        this.bd = new ProvinceRepository();
    }
    
    createProvince(province){
        const [verificacion,mensaje] = this.verificarProvince(province);
        if(verificacion){
            const resultado = this.bd.createProvince(province);
            return [resultado, null];
        }
        else{
            return [false,mensaje];
        }
    }

    updateProvince(province){
        const [verificacion,mensaje] = this.verificarProvince(province);
        if(verificacion){
            const resultado = this.bd.updateProvince(province);
            if(resultado.rowCount > 0){
                return [true,null];
            }
            else{
                return [false,null];
            }
        }
        else{
            return [false, mensaje];
        }
        
    }

    verificarProvince(province){
        if(province.name.length < 3){
            return [false, "El campo name está vacío o tiene menos de tres (3) letras."];
        }
        else if(isNaN(province.latitude) || isNaN(province.longitude)){
            return [false, "Los campos latitude y longitude no son números."];
        }
        else{
            return [true,null];
        }
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