import express from 'express';
import { ControllerStore } from '../controllers/stores.js';

const router = express.Router();

export class RouterStore {
    constructor() {
        this.controllerStore = new ControllerStore();
    }

    start() {
        router.post('/uploadStoreItems', this.controllerStore.uploadStoreItems);
        return router;
    }

}
