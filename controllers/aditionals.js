import { ApiAditional } from '../api/aditionals.js';

export class ControllerAditional {

    constructor() {
        this.apiAditional = new ApiAditional();
    }

    createAditional = async (req, res) => {
        try {
            const aditional = req.body;
            await this.apiAditional.createAditional(aditional);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getAditionals = async (_req, res) => {
        try {
            const aditional = await this.apiAditional.getAditionals();
            return res.status(200).json(aditional);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}