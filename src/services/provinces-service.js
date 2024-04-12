import { query } from "express";

export class ProvincesService{
    
    createProvince(name, full_name, latitude, longitude, display_order){
        const bd = new ProvincesRepository();
        const resultado = bd.createProvince(name, full_name, latitude, longitude, display_order);
        if(resultado != null){
            return true;
        }
        return false;
    }

    updateProvince(id, keys, values){
        const bd = new ProvincesRepository();
        var mensajeCondicion;
        const resultado = bd.updateProvince(id, mensajeCondicion);
        if(resultado != null){
            return true;
        }
        return false;
    }

    deleteProvincia(id){
        const bd = new ProvincesRepository();
        return bd.deleteProvince(id);
    }

    getAllProvinces(requestedPage, pageSize, url){
        const bd = new ProvincesRepository();
        const resultado = bd.getAllProvinces();
        return {
            pageSize: pageSize,
            page: requestedPage,
            nextPage: `http://localhost:3508/${url}?limit=${pageSize}&offset=${requestedPage+1}`
        };
    }

    getProvinceById(id){
        const bd = new ProvincesRepository();
        const resultado = bd.getProvinceById(id);
        return resultado;
    }
}