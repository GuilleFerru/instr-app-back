import express from 'express';
import {ControllerTimeSchedule} from '../controllers/timeSchedules.js';

const router = express.Router();

export class RouterTimeSchedule {
    constructor() {
        this.controllerTimeSchedule = new ControllerTimeSchedule();
    }

    start() {
        router.post('/create', this.controllerTimeSchedule.createTimeSchedule);
        router.get('/get', this.controllerTimeSchedule.getTimeSchedule);
        return router;
    }

}
