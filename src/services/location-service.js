import { query } from "express";
import { LocationRepository } from "../../repositories/locations-repository.js";

export class LocationService {
    constructor() {
        this.bd = new LocationRepository();
    }


}