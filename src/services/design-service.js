
import { DesignRepository } from "../../repositories/design-repository.js";

export default class DesignService {
    constructor (){
        this.bd = new DesignRepository();
    }

    async get(userId, designId){
        const response = this.bd.get(userId, designId);
        return response;
    }

    async save(userId, designId, image){
        const response = this.bd.save(userId, designId, image);
        return response;
    }
}