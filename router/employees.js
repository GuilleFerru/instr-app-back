import express from 'express';
import { ControllerEmployee } from '../controllers/employees.js';

const router = express.Router();

export class RouterEmployee {
    constructor() {
        this.controllerEmployee = new ControllerEmployee();
    }

    start() {
        router.post('/create', this.controllerEmployee.createEmployee);
        router.get('/get', this.controllerEmployee.getEmployeesData);
        router.get('/getForSchedule', this.controllerEmployee.getForScheduleEmployees);
        return router;
    }

}
