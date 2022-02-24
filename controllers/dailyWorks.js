import { ApiDailyWork } from '../api/dailyWorks.js';
import { formatDate } from '../utils/formatDate.js';

export class ControllerDailyWork {

    constructor() {
        this.apiDailyWork = new ApiDailyWork();
    }

    createDailyWork = async (req, res) => {
        try {

        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWork = async (req, res) => {
        try {
            const { date } = req.params;
            
            const resultado = false
            if (!resultado) {
                const created = await this.apiDailyWork.createDailyWork(date);
                if (created) {
                    return res.status(200).json(created);
                } else {
                    return res.status(500).json(created);
                }
            } else {
                return res.status(200).json(resultado);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }


}