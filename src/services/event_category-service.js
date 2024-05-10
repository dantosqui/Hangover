import { query } from "express";
import { EventCategoryRepository } from "../../repositories/event_category-repository.js";

export class EventCategoryService {
    constructor() {
        const bd = new EventCategoryRepository();
    }

    async getEvent_Category(limit, offset){
        const [event_categories,totalCount] = await bd.getEvent_Category(limit, offset, nextPage);
        const resultado = {
            
                collection: event_categories,
                pagination:
                    {
                        limit: limit,
                        offset: offset,
                        nextPage: (((offset+1)*limit <= totalCount) ? `${process.env.DB_USER}${nextPage}`:null),
                        total: totalCount
                    }
                };
        return resultado;
    }

    async getEvent_CategoryById(id){
        const resultado = await bd.getEvent_CategoryById(id);
        return resultado;
    }

    async createEventCategory(event_category){
         
    }

    async updateEventCategory(id){

    }

    async deleteEventCategory(id){

    }
}