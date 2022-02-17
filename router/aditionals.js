import express from 'express';
import {ControllerAditional} from '../controllers/aditionals.js';

const router = express.Router();

export class RouterAditional {
    constructor() {
        this.controllerAditional = new ControllerAditional();
    }

    start() {
        router.post('/create', this.controllerAditional.createAditional);
        router.get('get', this.controllerAditional.getAditional);
        return router;
    }

}