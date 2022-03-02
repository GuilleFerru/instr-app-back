import express from 'express';
import { ControllerAttelier } from '../controllers/attelieres.js';

const router = express.Router();

export class RouterAttelier {
    constructor() {
        this.controllerAttelier = new ControllerAttelier();
    }

    start() {
        router.post('/create', this.controllerAttelier.createAttellier);
        router.get('/get', this.controllerAttelier.getAttelieres);
        return router;
    }

}