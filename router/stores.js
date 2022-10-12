import express from 'express';
import { ControllerStore } from '../controllers/stores.js';
import { userExtractor } from '../utils/userExtractor.js';

const router = express.Router();

export class RouterStore {
    constructor() {
        this.controllerStore = new ControllerStore();
    }

    start() {
        router.post('/uploadStoreItems', userExtractor, this.controllerStore.uploadStoreItems);
        router.get('/searchBy/:value', userExtractor, this.controllerStore.getStoreItemBy);
        return router;
    }

}
