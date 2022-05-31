import express from 'express';
import { userExtractor } from '../utils/userExtractor.js';
import { ControllerDailyWork } from '../controllers/dailyWorks.js';

const router = express.Router();

export class RouterDailyWork {
    constructor() {
        this.controllerDailyWork = new ControllerDailyWork();
    }

    start() {
        router.post('/create', userExtractor, this.controllerDailyWork.createDailyWork);
        router.get('/get/:date', userExtractor, this.controllerDailyWork.getDailyWork);
        router.get('/getDailyWorkRoutine/:routineScheduleId', userExtractor, this.controllerDailyWork.getDailyWorkRoutine);
        router.get('/searchBy/:value', userExtractor, this.controllerDailyWork.getDailyWorkSearchBy);
        router.get('/getForPlantShutdown', this.controllerDailyWork.getDailyWorkForPlantShutdown);
        router.put('/update/:date', userExtractor, this.controllerDailyWork.updateDailyWork);
        router.put('/updateFromRoutineDetail', userExtractor, this.controllerDailyWork.updateFromRoutineDetail);
        router.put('/updateBulk/:date', userExtractor, this.controllerDailyWork.updateBulkDailyWork);
        router.delete('/delete', userExtractor, this.controllerDailyWork.deleteDailyWork);
        return router;
    }

}