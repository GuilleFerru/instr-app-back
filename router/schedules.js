import express from 'express';
import { userExtractor } from '../utils/userExtractor.js';
import { ControllerSchedule } from '../controllers/schedules.js';
import passport from 'passport';

const router = express.Router();

export class RouterSchedule {
    constructor() {
        this.controllerSchedule = new ControllerSchedule();
    }

    start() {
        router.post('/create', userExtractor, this.controllerSchedule.createSchedule);
        router.get('/get/:date', userExtractor, this.controllerSchedule.getSchedule);
        router.post('/postDailyShiftExcel', userExtractor, this.controllerSchedule.postDailyShiftExcel);
        router.get('/getDataForDailyShiftExcel/dataForSearch', userExtractor, this.controllerSchedule.getDataForDailyShiftExcel);
        router.put('/update/:date', userExtractor, this.controllerSchedule.updateSchedule);
        router.put('/update/columns/:date', userExtractor, this.controllerSchedule.updateScheduleColumns);

        //router.get('/convert', this.controllerSchedule.convertDateToDate)
        return router;
    }

}