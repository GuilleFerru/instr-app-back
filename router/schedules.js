import express from 'express';
import { ControllerSchedule } from '../controllers/schedules.js';

const router = express.Router();

export class RouterSchedule {
    constructor() {
        this.controllerSchedule = new ControllerSchedule();
    }

    start() {
        router.post('/create', this.controllerSchedule.createSchedule);
        router.get('/get/:date', this.controllerSchedule.getSchedule);
        router.put('/update/:date', this.controllerSchedule.updateSchedule);
        router.put('/update/columns/:date', this.controllerSchedule.updateScheduleColumns);
        return router;
    }

}