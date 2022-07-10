import express from 'express';
import { userExtractor } from '../utils/userExtractor.js';
import { ControllerDashboard } from '../controllers/dashboard.js';

const router = express.Router();

export class RouterDashboard {
    constructor() {
        this.controllerDashboard = new ControllerDashboard();
    }

    start() {
        router.get('/getWidgetData/:date', userExtractor, this.controllerDashboard.getWidgetData);
        router.get('/getChartsData/:date', userExtractor, this.controllerDashboard.getChartsData);
        return router;
    }

}
