import { ApiAttelier } from '../api/attelieres.js';

export class ControllerAttelier {

    constructor() {
        this.apiAttelier = new ApiAttelier();
    }

    createAttellier = async (req, res) => {
        try {
            const attelier = req.body;
            await this.apiAttelier.createAttelier(attelier);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getAttelieres = async (_req, res) => {
        try {
            const attelieres = await this.apiAttelier.getAttelieres();
            return res.status(200).json(attelieres);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}