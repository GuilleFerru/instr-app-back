import mongoose from "mongoose";
import config from "../../config.js";
import { shiftModel } from "../models/Shifts.js";
import { empModel } from "../models/Employees.js";
import { scheduleModel } from "../models/Schedules.js";
import { timeScheduleModel } from "../models/TimeSchedules.js";
import { workHoursModel } from "../models/WorkHours.js";
import { aditionalModel } from "../models/Aditionals.js";
import { attelierModel } from "../models/Attelieres.js";
import { tagModel } from "../models/Tags.js";
import { manteinanceModel } from "../models/Manteinances.js";
import { manteinanceActionModel } from "../models/ManteinanceActions.js";
import { dailyWorkModel } from "../models/DailyWorks.js";
import { routineModel } from "../models/Routines.js";
import { routineScheduleModel } from "../models/RoutinesSchedule.js";
import { loggerError, loggerInfo } from "../../utils/logger.js";
import { shiftDTO } from '../DTOs/shifts.js';
import { employeeDTO } from '../DTOs/employee.js';
import { plantsModel } from '../models/Plants.js';
import { dailyWorkColumnsModel } from '../models/DailyWorksColumns.js';
import { otherRoutineColumnModel } from '../models/OthersRoutinesColumns.js';


const MONGO_URL = config.MONGO_URL;

export class DBMongoDao {

    constructor() {
        (async () => {
            loggerInfo.info("Contectando a la Base de datos...");
            this.connection = await mongoose.connect(MONGO_URL);
            loggerInfo.info("Base de datos conectada", this.connection.connection.host);
        })();
    }

    /* TURNOS   */

    createShift = async (shifts) => {
        try {
            await shiftModel.insertMany(shiftDTO(shifts));
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getShift = async (date) => {
        try {
            const shiftResp = await shiftModel.find({ date: date }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return shiftResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    dropShiftCollection = async () => {
        try {
            await shiftModel.deleteMany({});
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */

    /* HORAS TRABAJADAS */

    getWorkHours = async () => {
        try {
            const workHours = await workHoursModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
            return workHours;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* EMPLEADOS */

    createEmployee = async (employee) => {
        try {
            const empResp = await empModel.insertMany(employeeDTO(employee));
            return empResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getEmployees = async () => {
        try {
            const empResp = await empModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
            return empResp;
        } catch (error) {
            loggerError.error(error)
        }
    }
    /*          */

    /* ADICIONALES */
    createAditional = async (aditional) => {
        try {
            const aditionalResp = await aditionalModel.insertMany(aditional);
            return aditionalResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getAditionals = async () => {
        try {
            const aditionalResp = await aditionalModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
            return aditionalResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* SCHEDULE */

    createSchedule = async (schedule) => {
        try {
            const scheduleResp = await scheduleModel.insertMany(schedule);
            return scheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getSchedule = async (date) => {
        try {
            const scheduleResp = await scheduleModel.find({ date: date }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return scheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateSchedule = async (date, schedule) => {
        try {
            const scheduleResp = await scheduleModel.updateMany({ date: date }, { $set: { schedule } });
            return scheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createTimeSchedule = async (timeSchedule) => {
        try {

            const timeScheduleResp = await timeScheduleModel.insertMany(timeSchedule);
            return timeScheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getTimeSchedule = async () => {
        try {
            const timeScheduleResp = await timeScheduleModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return timeScheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    dropTimeScheduleCollection = async () => {
        try {
            await timeScheduleModel.deleteMany({});
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateScheduleColumns = async (date, columns) => {
        try {
            const scheduleResp = await scheduleModel.updateMany({ date: date }, { $set: { columns } });
            return scheduleResp;
        } catch (error) {
            loggerError.error(error)
        }

    }

    /*          */


    /* PLANTAS */

    createPlant = async (plant) => {
        try {
            const plantResp = await plantsModel.insertMany(plant);
            return plantResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlants = async () => {
        try {
            const plantResp = await plantsModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return plantResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* ATTELIERES */

    createAttelier = async (attelier) => {
        try {
            const attelierResp = await attelierModel.insertMany(attelier);
            return attelierResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getAttelieres = async () => {
        try {
            const attelierResp = await attelierModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return attelierResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getAttelieresByPlant = async (plant) => {
        try {
            const attelierResp = await attelierModel.find({ plant: plant }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return attelierResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* TAGS */

    createTag = async (tag) => {
        try {
            const tagResp = await tagModel.insertMany(tag);
            return tagResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getTag = async (tag) => {
        try {
            const tagResp = await tagModel.find({ tag: tag }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return tagResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* MANTEINANCE */

    createManteinance = async (manteinance) => {
        try {
            const manteinanceResp = await manteinanceModel.insertMany(manteinance);
            return manteinanceResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getManteinances = async () => {
        try {
            const manteinanceResp = await manteinanceModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return manteinanceResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* MANTEINANCE ACTIONS  */

    createManteinanceAction = async (manteinanceAction) => {
        try {
            const manteinanceActionResp = await manteinanceActionModel.insertMany(manteinanceAction);
            return manteinanceActionResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getManteinanceActions = async () => {
        try {
            const manteinanceActionResp = await manteinanceActionModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return manteinanceActionResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /* DAILYWORKS   */

    createDailyWork = async (dailyWork) => {
        try {
            console.log(dailyWork)
            // const dailyWorkResp = await dailyWorkModel.insertMany(dailyWork);
            // return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWork = async (date) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ beginDate: date }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateDailyWork = async (date, dailyWork) => {
        try {
            await dailyWorkModel.updateOne({ $and: [{ "beginDate": date }, { "_id": dailyWork._id }] }, {
                $set: {
                    "plant": dailyWork.plant,
                    "attelier": dailyWork.attelier,
                    "tag": dailyWork.tag,
                    "timeSchedule": dailyWork.timeSchedule,
                    "manteinance": dailyWork.manteinance,
                    "ot": dailyWork.ot,
                    "action": dailyWork.action,
                    "description": dailyWork.description,
                    "complete": dailyWork.complete,
                    "beginDate": dailyWork.beginDate,
                    "endDate": dailyWork.endDate,
                    "routineScheduleId": dailyWork.routineScheduleId,
                    "sector": dailyWork.sector,
                }
            });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updateDailyWorkRoutineOtBySchedRoutineId = (routineScheduleId, ot) => {
        try {
            dailyWorkModel.updateMany({ routineScheduleId: routineScheduleId }, {
                $set: {
                    ot: ot,
                }
            });
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    deleteDailyWork = async (id) => {
        try {
            const dailyWorkResp = await dailyWorkModel.deleteMany({ _id: id });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    /*          */


    /* ROUTINES */

    createRoutine = async (routine) => {
        try {
            const routineResp = await routineModel.insertMany(routine);
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getRoutine = async (id) => {
        try {
            const routineResp = await routineModel.find({ _id: id }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getRoutineBettwenDates = async (dayone, daytwo) => {
        try {
            const routineResp = await routineModel.find({ $and: [{ beginDate: { $gte: dayone } }, { endDate: { $lte: daytwo } }] }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }

    }


    getRoutineScheduleBetweenDates = async (startDate, endDate) => {
        try {
            const routineResp = await routineScheduleModel.find({ startDate: { $gte: startDate }, endDate: { $lte: endDate } }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }
    }


    getLastRoutineId = async () => {
        try {
            const routineResp = await routineModel.find({}, { _id: 1, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ _id: -1 }).limit(1);
            const routineId = routineResp[0]._id;
            return routineId;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createRoutineSchedule = async (routineSchedule) => {
        try {
            const routineScheduleResp = await routineScheduleModel.insertMany(routineSchedule);
            return routineScheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }


    getActualMonthRoutineSchedule = async (checkDays) => {
        try {
            const routineResp = await routineScheduleModel.find({ $and: [{ complete: false }, { checkDays: checkDays }] }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }
    }


    getAllRoutinesSchedules = async (date) => {
        try {
            const routineResp = await routineScheduleModel.find({ $and: [{ startDate: { $lte: date } }, { dueDate: { $gte: date } }] }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updateRoutineScheduleOT = async (id, ot) => {
        try {
            await routineScheduleModel.updateOne({ "_id": id }, {
                $set: {
                    "ot": ot
                }
            });
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateRoutineScheduleByDueDate = async (dueDate) => {
        try {
            await routineScheduleModel.updateMany({ "dueDate": dueDate }, {
                $set: {
                    "complete": true
                }
            });
            const updatedRoutinesSchedules = await routineScheduleModel.find({ "dueDate": dueDate }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return updatedRoutinesSchedules;
        } catch (error) {
            loggerError.error(error)
        }
    }

    //SEGUIR DESDE ACA... VER COMO ACTUALIZAR.
    updateRoutineScheduleByCompleteTask = async (id) => {
        try {
            await routineScheduleModel.updateMany({ "_id": id }, {
                $set: {
                    "complete": true,
                }
            });
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }


    /*   COLUMNAS DE TABLAS */


    createDailyWorksColumns = async (columns) => {
        try {
            const dailyWorkColumns = await dailyWorkColumnsModel.insertMany(columns);
            return dailyWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWorksColumns = async () => {
        try {
            const dailyWorkColumns = await dailyWorkColumnsModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getIdDailyWorkColumns = async () => {
        try {
            const dailyWorkColumns = await dailyWorkColumnsModel.find({}, { _id: 1, columns: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ "_id": -1 }).limit(1);
            return dailyWorkColumns[0]._id;
        } catch (error) {
            loggerError.error(error)
        }
    }

    deleteDailyWorksColumns = async (id) => {
        try {
            const dailyWorkColumns = await dailyWorkColumnsModel.deleteMany({ _id: id });
            return dailyWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createOthersRoutinesColumns = async (columns) => {
        try {
            const othersRoutinesColumns = await otherRoutineColumnModel.insertMany(columns);
            return othersRoutinesColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getOtherRoutinesColumns = async () => {
        try {
            const othersRoutinesColumns = await otherRoutineColumnModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return othersRoutinesColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }



    /*          */



}


