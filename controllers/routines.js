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

    getAllRoutine = async (req, res) => {
        try {
            const { date } = req.params;
            const routine = await this.apiRoutine.getAllRoutine(date);
            if (routine) {
                return res.status(200).json(routine);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    updateRoutineScheduleByCompleteTask = async (req, res) => {
        try {
            const { data } = req.body;
            const routine = await this.apiRoutine.updateRoutineScheduleByCompleteTask(data);
            if (routine) {
                const date = new Date();
                res.status(200).json(await this.apiRoutine.getAllRoutine(date));
            } else {
                res.status(500).json(false);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    updateRoutineScheduleOT = async (req, res) => {
        try {
            const { data } = req.body;
            const routine = await this.apiRoutine.updateRoutineScheduleOT(data);
            return res.status(200).json(routine);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getQtyOverdueRoutines = async (_req, res) => {
        try {
            const qtyOverdueRoutines = await this.apiRoutine.getQtyOverdueRoutines();
            return res.status(200).json(qtyOverdueRoutines);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
