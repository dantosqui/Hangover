import { query } from "express";
import { LocationRepository } from "../../repositories/location-repository.js";

export class LocationService {
    constructor() {
        const bd = new LocationRepository();
    }

    
}