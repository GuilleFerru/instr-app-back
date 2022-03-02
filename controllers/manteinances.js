import { ApiManteinance } from '../api/manteinances.js';

export class ControllerManteinance {

    constructor() {
        this.apiManteinance = new ApiManteinance();
    }

    createManteinance = async (req, res) => {
        try {
            console.log(req.body)
            const manteinance = req.body;
            const mantResp = await this.apiManteinance.createManteinance(manteinance);
            return res.status(200).json({ mantResp });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

}
