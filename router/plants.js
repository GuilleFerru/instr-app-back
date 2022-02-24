import express from 'express';
import { ControllerPlant } from '../controllers/plants.js';

const router = express.Router();

export class RouterPlant {
    constructor() {
        this.controllerPlant = new ControllerPlant();
    }

    start() {
        router.post('/create', this.controllerPlant.createPlant);
        router.get('/get', this.controllerPlant.getPlants);
        return router;
    }

}