import express from 'express';
import { ControllerDailyWork } from '../controllers/dailyWorks.js';

const router = express.Router();

export class RouterDailyWork {
    constructor() {
        this.controllerDailyWork = new ControllerDailyWork();
    }

    start() {
        router.post('/create', this.controllerDailyWork.createDailyWork);
        router.get('/get/:date', this.controllerDailyWork.getDailyWork);
        return router;
    }

}