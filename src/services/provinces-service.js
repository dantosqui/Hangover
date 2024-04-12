import { query } from "express";

export class ProvincesService{
    
    createProvince(name, full_name, latitude, longitude, display_order){
        const bd = new ProvincesRepository();
        const resultado = bd.createProvince(name, full_name, latitude, longitude, display_order);
        if(resultado){
            return true;
        }
        return false;
    }

    actualizarProvince(id, keys, values){
        const bd = new ProvincesRepository();
        var mensajeCondicion;
        if(keys){
            for (let i = 0; i < keys.length; i++) {
                if(mensajeCondicion.includes("SET")){
                    mensajeCondicion += `, ${keys[i]} = ${values[i]}`;
                }
                else{
                    mensajeCondicion += ` SET ${keys[i]} = ${values[i]}`;
                }
            }
        }
        const resultado = bd.updateProvince(id);
        if(resultado){
            return true;
        }
        return false;
    }

    eliminarProvincia(id){
        const bd = new ProvincesRepository();
        const resultado = bd.deleteProvince(id);
        if(resultado){
            return true;
        }
        return false;
    }
}