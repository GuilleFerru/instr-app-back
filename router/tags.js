import express from 'express';
import {ControllerTag} from '../controllers/tags.js';

const router = express.Router();

export class RouterTag {
    constructor() {
        this.controllerTag = new ControllerTag();
    }

    start() {
        router.post('/create', this.controllerTag.createTag);
        router.get('/get/:tag', this.controllerTag.getTag);
        return router;
    }

}
