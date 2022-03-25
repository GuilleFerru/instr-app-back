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
        router.get('/getDailyWorkRoutine/:routineScheduleId', this.controllerDailyWork.getDailyWorkRoutine);
        router.get('/searchBy/:value', this.controllerDailyWork.getDailyWorkSearchBy);
        router.put('/update/:date', this.controllerDailyWork.updateDailyWork);
        router.put('/updateFromRoutineDetail', this.controllerDailyWork.updateFromRoutineDetail);
        router.put('/updateBulk/:date', this.controllerDailyWork.updateBulkDailyWork);
        router.delete('/delete', this.controllerDailyWork.deleteDailyWork);
        return router;
    }

}