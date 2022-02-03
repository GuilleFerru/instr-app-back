import { ApiShift } from '../api/shifts.js';

export class ControllerShift {

    constructor() {
        this.apiShift = new ApiShift();
    }

    createShift = async (req, res) => {
        try {
            const { turno } = req.body;
            const shift = await this.apiShift.createShift(turno);
            return res.status(200).json(shift);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
