import { ApiDashboard } from '../api/dashboard.js';

export class ControllerDashboard {

    constructor() {
        this.apiDashboard = new ApiDashboard();
    }

    getDashboardData = async (req, res) => {
        try {
            const { date } = req.params;
            const resultado = await this.apiDashboard.getDashboardData(date);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
