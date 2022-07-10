import { ApiDashboard } from '../api/dashboard.js';

export class ControllerDashboard {

    constructor() {
        this.apiDashboard = new ApiDashboard();
    }

    getWidgetData = async (req, res) => {
        try {
            const { date } = req.params;
            const resultado = await this.apiDashboard.getWidgetData(date);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getChartsData = async (req, res) => {
        try {
            const { date } = req.params;
            const resultado = await this.apiDashboard.getChartsData(date);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
