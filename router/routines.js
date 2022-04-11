import express from 'express';
import timeout from "connect-timeout";
import { ControllerRoutine } from '../controllers/routines.js';
import { userExtractor } from '../utils/userExtractor.js';

const router = express.Router();

const haltOnTimedoutMiddleware = () => {
    if (!req.timedout) next()
}

export class RouterRoutine {
    constructor() {
        this.controllerRoutine = new ControllerRoutine();
    }

    start() {
        router.post('/create', userExtractor, this.controllerRoutine.createRoutine);
        router.get('/get', userExtractor, this.controllerRoutine.getRoutine);
        router.get('/getAllRoutines/:date', userExtractor, timeout('50s'), haltOnTimedoutMiddleware, this.controllerRoutine.getAllRoutine);
        router.put('/update', userExtractor, this.controllerRoutine.updateRoutineScheduleByCompleteTask);
        router.put('/updateOt', userExtractor, this.controllerRoutine.updateRoutineScheduleOT);
        return router;
    }



}

