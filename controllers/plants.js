import { ApiPlant } from '../api/plants.js';

export class ControllerPlant {

    constructor() {
        this.apiPlant = new ApiPlant();
    }

    createPlant = async (req, res) => {
        try {
            const { name, id } = req.body;
            await this.apiPlant.createPlant(id, name);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getPlants = async (_req, res) => {
        try {
            const plants = await this.apiPlant.getPlants();
            return res.status(200).json(plants);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }


}