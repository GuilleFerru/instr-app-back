import { ApiPlantShutdown } from '../api/plantShutdowns.js';

export class ControllerPlantShutdown {

    constructor() {
        this.apiPlantShutdown = new ApiPlantShutdown();
    }

    createPlantShutdown = async (req, res) => {
        try {

            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getPlantShutdowns = async (req, res) => {
        try {
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

}
