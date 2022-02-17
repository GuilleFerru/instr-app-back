import { ApiTimeSchedule } from '../api/timeSchedules.js';

export class ControllerTimeSchedule {

    constructor() {
        this.apiTimeSchedule = new ApiTimeSchedule();
    }

    createTimeSchedule = async (req, res) => {
        try {
            // const {timeSchedule} = req.body;
            const timeSchedule = req.body;
            await this.apiTimeSchedule.createTimeSchedule(timeSchedule);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getTimeSchedule = async (_req, res) => {
        try {
            const timeSchedule = await this.apiTimeSchedule.getTimeSchedule();
            return res.status(200).json(timeSchedule);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    dropTimeSchedule = async (req, res) => {
        try {
            const {timeSchedule} = req.body;
            await this.apiTimeSchedule.dropTimeSchedule(timeSchedule);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
