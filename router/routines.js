import express from 'express';
import { ControllerRoutine } from '../controllers/routines.js';

const router = express.Router();

export class RouterRoutine {
    constructor() {
        this.controllerRoutine = new ControllerRoutine();
    }

    start() {
        router.post('/create', this.controllerRoutine.createRoutine);
        router.get('/get', this.controllerRoutine.getRoutine);
        router.get('/get/:date', this.controllerRoutine.getAllRoutine);
        router.put('/update', this.controllerRoutine.updateRoutineScheduleByCompleteTask);
        router.put('/updateOt', this.controllerRoutine.updateRoutineScheduleOT);
        return router;
    }

}