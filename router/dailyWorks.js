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
        router.get('/searchAdvance/dataForSearch', userExtractor, this.controllerDailyWork.getDailyWorkSearchAdvance)
        router.get('/getForPlantShutdown', this.controllerDailyWork.getDailyWorkForPlantShutdown);
        router.get('/dataForSearch', this.controllerDailyWork.getDailyWorkDataForSearch);
        router.put('/update/:date', userExtractor, this.controllerDailyWork.updateDailyWork);
        router.put('/updateFromRoutineDetail', userExtractor, this.controllerDailyWork.updateFromRoutineDetail);
        router.put('/updateBulk/:date', userExtractor, this.controllerDailyWork.updateBulkDailyWork);
        router.delete('/delete', userExtractor, this.controllerDailyWork.deleteDailyWork);

        router.get('/convert', this.controllerDailyWork.convertBeginDateToDate);
        return router;
    }

}