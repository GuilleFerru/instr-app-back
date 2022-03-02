import express from 'express';
import { ControllerManteinanceAction } from '../controllers/manteinanceActions.js';

const router = express.Router();

export class RouterManteinanceAction {
    constructor() {
        this.controllerManteinanceAction = new ControllerManteinanceAction();
    }

    start() {
        router.post('/create', this.controllerManteinanceAction.createManteinanceAction);
        return router;
    }

}