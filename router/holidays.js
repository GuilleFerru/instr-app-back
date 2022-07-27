import express from 'express';
import { ControllerHoliday } from '../controllers/holidays.js';

const router = express.Router();

export class RouterHoliday {
    constructor() {
        this.controllerHoliday = new ControllerHoliday();
    }

    start() {
        router.post('/createPeriod', this.controllerHoliday.createPeriod);
        router.get('/getData/:date', this.controllerHoliday.getData);
        router.get('/getPeriodPoints/:date', this.controllerHoliday.getPeriodPoints);
        return router;
    }

}
