import { ApiRoutine } from '../api/routines.js';

export class ControllerRoutine {

    constructor() {
        this.apiRoutine = new ApiRoutine();
    }

    createDayRoutine = async (req, res) => {
        try {
            const { date } = req.params;
            
            await this.apiRoutine.createRoutine(date);
            return res.status(200).json(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
