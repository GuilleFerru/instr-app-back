import express from 'express';
import { ControllerPlantShutdown } from '../controllers/plantShutdowns.js';
import { userExtractor } from '../utils/userExtractor.js';

const router = express.Router();

export class RouterPlantShutdown {
    constructor() {
        this.controllerPlantShutdown = new ControllerPlantShutdown();
    }

    start() {
        router.post('/create', userExtractor, this.controllerPlantShutdown.createPlantShutdown);
        router.get('/get', userExtractor, this.controllerPlantShutdown.getPlantShutdowns);;
        return router;
    }



}

