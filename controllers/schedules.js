import { ApiSchedule } from '../api/schedules.js';
import { loggerError } from '../utils/logger.js';

export class ControllerSchedule {

    constructor() {
        this.apiSchedule = new ApiSchedule();
    }

    createSchedule = async (req, res) => {
        try {

            const { date } = req.body;


            return res.status(200).json(true);
        } catch (err) {
            loggerError.error(err);
            return res.status(500).json(err);
        }
    }

    getSchedule = async (req, res) => {
        try {
            const { date } = req.params;
            const dateLocal = new Date(date).toLocaleString("es-AR", { dateStyle: "short" });
            const resultado = await this.apiSchedule.getSchedule(dateLocal);
            if (!resultado) {
                const created = await this.apiSchedule.createSchedule(dateLocal);
                if (created) {
                    return res.status(200).json(created);
                } else {
                    return res.status(500).json(created);
                }
            } else {
                return res.status(200).json(resultado);
            }
        } catch (error) {
            loggerError.error(error)
            return res.status(500).json(error);
        }
    }

    updateSchedule = async (req, res) => {
        try {
            const { date } = req.params;
            const { newSchedule } = req.body;
            const dateLocal = new Date(date).toLocaleString("es-AR", { dateStyle: "short" }); 
            const resultado = await this.apiSchedule.updateSchedule(dateLocal,newSchedule);
            if (resultado) {
                return res.status(200).json(resultado);
            } else {
                const created = await this.apiSchedule.createSchedule(dateLocal);
                if (created) {
                    return res.status(200).json(created);
                } else {
                    return res.status(500).json(created);
                }
            }
        } catch (error) {
            loggerError.error(error)
            return res.status(500).json(error);
        }
    }
}
