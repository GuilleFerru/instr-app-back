import express from 'express';
import {ControllerShift} from '../controllers/shifts.js';

const router = express.Router();

export class RouterShift {
    constructor() {
        this.controllerShift = new ControllerShift();
    }

    start() {
        router.post('/create', this.controllerShift.createShift);
        return router;
    }

}
