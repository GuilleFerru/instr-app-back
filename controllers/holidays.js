import { ApiHoliday } from '../api/holidays.js';

export class ControllerHoliday {

    constructor() {
        this.apiHoliday = new ApiHoliday();
    }

    createPeriod = async (req, res) => {
        try {
            const periodResp = await this.apiHoliday.createPeriod(req.body);
            if (periodResp === 'duplicate') {
                return res.status(409).json({ periodResp: "duplicate" });
            } else {
                return res.status(200).json(periodResp);
            }
        } catch (err) {
            //console.log('controller'+err);
            return res.status(500).json(err);
        }
    }

    getData = async (req, res) => {
        try {
            const { date } = req.params;
            const scoreResp = await this.apiHoliday.getData(date);
            return res.status(200).json(scoreResp);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getPeriodPoints = async (req, res) => {
        try {
            const { date } = req.params;
            const pointsResp = await this.apiHoliday.getPeriodPoints(date);
            return res.status(200).json(pointsResp);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

}
