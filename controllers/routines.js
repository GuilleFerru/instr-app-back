import { ApiRoutine } from "../api/routines.js";
import { loggerError } from "../utils/logger.js";

export class ControllerRoutine {
  constructor() {
    this.apiRoutine = new ApiRoutine();
  }

  createRoutine = async (req, res) => {
    try {
      const routine = req.body;
      const routineResp = await this.apiRoutine.createRoutine(routine);
      return res.status(200).json(routineResp);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(false);
    }
  };

  getRoutine = async (req, res) => {
    try {
      const { date } = req.params;
      const routine = await this.apiRoutine.getRoutine(date);
      return res.status(200).json(routine);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  getAllRoutine = async (req, res) => {
    try {
      const { date } = req.params;
      const routine = await this.apiRoutine.getAllRoutine(date);
      if (routine) {
        return res.status(200).json(routine);
      }
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  getDataForRoutineCrud = async (_req, res) => {
    try {
      const data = await this.apiRoutine.getDataForRoutineCrud();
      return res.status(200).json(data);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  getDataForRoutineEdit = async (req, res) => {
    try {
      const dataToJSON = JSON.parse(req.query.params);
      const routineId = dataToJSON.routineId;
      const data = await this.apiRoutine.getDataForRoutineEdit(routineId);
      return res.status(200).json(data);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  updateRoutine = async (req, res) => {
    try {
      const routine = req.body;
      const routineResp = await this.apiRoutine.updateRoutine(routine);
      return res.status(200).json(routineResp);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(false);
    }
  };

  updateRoutineScheduleByCompleteTask = async (req, res) => {
    try {
      const { data } = req.body;
      const routine = await this.apiRoutine.updateRoutineScheduleByCompleteTask(
        data
      );
      if (routine) {
        const date = new Date();
        res.status(200).json(await this.apiRoutine.getAllRoutine(date));
      } else {
        res.status(500).json(false);
      }
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  updateRoutineScheduleOT = async (req, res) => {
    try {
      const { data } = req.body;
      const routine = await this.apiRoutine.updateRoutineScheduleOT(data);
      return res.status(200).json(routine);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  getQtyOverdueRoutines = async (_req, res) => {
    try {
      const qtyOverdueRoutines = await this.apiRoutine.getQtyOverdueRoutines();
      return res.status(200).json(qtyOverdueRoutines);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };

  createMonthRoutine = async (_req, res) => {
    try {
        const createMonthRoutine = await this.apiRoutine.createMonthRoutine();
        return res.status(200).json(createMonthRoutine);
    } catch (err) {
      loggerError.error(err);
      return res.status(500).json(err);
    }
  };
}
