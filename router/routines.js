import express from 'express';
import { ControllerRoutine } from '../controllers/routines.js';
import { userExtractor } from '../utils/userExtractor.js';

const router = express.Router();

export class RouterRoutine {
    constructor() {
        this.controllerRoutine = new ControllerRoutine();
    }

    start() {
        router.post('/create', userExtractor, this.controllerRoutine.createRoutine);
        router.get('/get', userExtractor, this.controllerRoutine.getRoutine);
        router.get('/get/:date', userExtractor, this.controllerRoutine.getAllRoutine);
        router.put('/update', userExtractor, this.controllerRoutine.updateRoutineScheduleByCompleteTask);
        router.put('/updateOt', userExtractor, this.controllerRoutine.updateRoutineScheduleOT);
        return router;
    }

}