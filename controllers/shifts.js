import { ApiShift } from '../api/shifts.js';

export class ControllerShift {

    constructor() {
        this.apiShift = new ApiShift();
    }

    createShift = async (req, res) => {
        try {
            const rounds = req.body.rounds !== undefined ? req.body.rounds : 1;
            await this.apiShift.createShift(rounds);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
