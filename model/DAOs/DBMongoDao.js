import mongoose from "mongoose";
import config from "../../config.js";
import { shiftModel } from "../models/Shifts.js";
import { empModel } from "../models/Employees.js";
import { scheduleModel } from "../models/Schedules.js";
import { timeScheduleModel } from "../models/TimeSchedules.js";
import { workHoursModel } from "../models/WorkHours.js";
import { aditionalModel } from "../models/Aditionals.js";
import { loggerError, loggerInfo, loggerWarn } from "../../utils/logger.js";
import { shiftDTO } from '../DTOs/shifts.js';
import { employeeDTO } from '../DTOs/employee.js';
import { plantsModel } from '../models/Plants.js';

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

    /* DAILYWORKS   */

    createDailyWork = async (dailyWork) => {
        try {
            const dailyWorkResp = await dailyWorkModel.insertMany(dailyWork);
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWork = async (date) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ date: date }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }




}