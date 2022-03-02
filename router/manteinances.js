import express from 'express';
import { ControllerManteinance } from '../controllers/manteinances.js';

const router = express.Router();

export class RouterManteinance {
    constructor() {
        this.controllerManteinance = new ControllerManteinance();
    }

    start() {
        router.post('/create', this.controllerManteinance.createManteinance);
        return router;
    }

}