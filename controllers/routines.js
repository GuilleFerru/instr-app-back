import { ApiRoutine } from '../api/routines.js';

export class ControllerRoutine {

    constructor() {
        this.apiRoutine = new ApiRoutine();
    }

    createRoutine = async (req, res) => {
        try {
            const routine = req.body;
            await this.apiRoutine.createRoutine(routine);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getRoutine = async (req, res) => {
        try {
            const { date } = req.params;
            const routine = await this.apiRoutine.getRoutine(date);
            return res.status(200).json(routine);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getOtherRoutine = async (req, res) => {
        try {
            const { date } = req.params;
            const routine = await this.apiRoutine.getOtherRoutine(date);
            return res.status(200).json(routine);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
