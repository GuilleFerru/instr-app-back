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
import { dailyWorkRoutineColumnModel } from '../models/DailyWorkRoutinesColumns.js';
import { plantShutdownsColumnsSchemaModel } from '../models/PlantShutdownsColumns.js';
import { plantShutdownWorksToDoColumnsSchemaModel } from '../models/PlantShutdownWorkToDoColumns.js';
import { plantShutdownModel } from '../models/PlantShutdowns.js';
import { plantShutdownWorkModel } from '../models/PlantShutdownWorks.js';
import { plantShutdownWorksColumnsSchemaModel } from '../models/PlantShutdownWorksColumns.js';
import { plantShutdowndailyWorksColumnsSchemaModel } from '../models/PlantShutdownDailyWorksColumns.js'
import { holidayScoreColumnsModel } from '../models/HolidayScoreColumns.js';
import { holidayModel } from '../models/Holidays.js';

//const MONGO_URL = config.MONGO_URL_DEV;
const MONGO_URL = config.MONGO_URL;

export class DBMongoDao {


    constructor() {
        (async () => {
            loggerInfo.info("Contectando a la Base de datos...");
            this.connection = await mongoose.connect(MONGO_URL);
            this.conn = mongoose.connection;
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
            const empResp = await empModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ createdAt: 1 });
            return empResp;
        } catch (error) {
            loggerError.error(error)
        }
    }
    getEmployeeBylegajo = async (legajo) => {
        try {
            const empResp = await empModel.find({ legajo: legajo }, { __v: 0, createdAt: 0, updatedAt: 0 });
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

    getSchedulesBettweenDates = async (startDate, endDate) => {
        try {
            const scheduleResp = await scheduleModel.find({ dateTime: { $gte: startDate, $lte: endDate } }, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ dateTime: 1 });
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

    deleteSchedule = async (date, schedule) => {
        try {
            const scheduleResp = await scheduleModel.updateMany({ date: date }, { $set: { schedule } });
            return scheduleResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    deleteAllSchedule = async (date) => {
        try {
            const scheduleResp = await scheduleModel.deleteMany({ date: date });
            return scheduleResp && true;
        } catch (error) {
            console.log(error)
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

    getScheduleWithEmployee = async (date) => {
        try {
            const scheduleResp = await scheduleModel.aggregate([{
                $match: {
                    date: date
                }
            }, {
                $lookup:
                {
                    from: "employees",
                    localField: "schedule.legajo",
                    foreignField: "legajo",
                    as: "employeeData"
                }
            }]);
            return scheduleResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    // getQtyDailyEmployees = async (date) => {
    //     try {
    //         const scheduleResp = await scheduleModel.find({ date: date, "schedule.timeSchedule": 5 }, { __v: 0, createdAt: 0, updatedAt: 0 });
    //         return scheduleResp;
    //     } catch (error) {
    //         console.log(err);
    //         loggerError.error(error)
    //     }
    // }

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
            const plantResp = await plantsModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 });
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
            const attelierResp = await attelierModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).sort({ id: 1 });
            return attelierResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getAttelieresGroupByPlant = async () => {
        try {
            const attelierResp = await attelierModel.aggregate([
                {
                    $group: {
                        _id: '$plant',
                        atteliers: {
                            $push: {
                                name: '$name',
                                id: '$id',
                            }
                        }
                    },
                },
                {
                    $sort: { _id: -1 }
                }
            ]);
            return attelierResp;
        } catch (error) {
            console.log(error)
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
            const dailyWorkResp = await dailyWorkModel.insertMany(dailyWork);
            return dailyWorkResp;
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

    getDailyWorkById = async (id) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ _id: id }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWorkRoutine = async (routineScheduleId) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ routineScheduleId: routineScheduleId }, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ createdAt: 1 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWorkSearchBy = async (value) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({
                $or: [
                    { "tag": { $regex: value, $options: 'i' } },
                    { "ot": { $regex: value, $options: 'i' } },
                    { "description": { $regex: value, $options: 'i' } }
                ]
            }, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ createdAt: -1 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWorkSearchAdvance = async (query, startDate, endDate) => {
        try {
            const andQuery = [];
            const beginDate = { beginDateTime: { $gte: new Date(startDate) } };
            const finishDate = { endDateTime: { $lte: new Date(endDate) } };

            if (query.complete) {
                if (query.complete === 'C') {
                    andQuery.push(beginDate, finishDate);
                } else {
                    andQuery.push(beginDate);
                }
            } else {
                andQuery.push(beginDate, finishDate);
            }
            const dailyWorkResp = await dailyWorkModel.find({ ...query, $and: andQuery }, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ beginDateTime: -1 });
            return dailyWorkResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    getDailyWorkForPlantShutdown = async () => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ $and: [{ complete: 'PP' }, { "plantShutdownWorkId": { $eq: 1 } }] }, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ createdAt: 1 });
            return dailyWorkResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    getDailyWorkByPlantShutdownWorkId = async (plantShutdownWorkId) => {
        try {
            const dailyWorkResp = await dailyWorkModel.find({ "plantShutdownWorkId": plantShutdownWorkId }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getManteinanceActionsForChartDashboard = async (startDate, endDate) => {
        try {
            const manteinanceActionResp = await dailyWorkModel.find({
                $and: [
                    { beginDateTime: { $gte: startDate } },
                    { beginDateTime: { $lte: endDate } }
                ]
            }, {
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
                _id: 0,
                attelier: 0,
                tag: 0,
                timeSchedule: 0,
                ot: 0,
                description: 0,
                complete: 0,
                sector: 0,
                plantShutdownWorkId: 0,
                routineScheduleId: 0,
                beginDateTime: 0,
                endDateTime: 0,
                beginDate: 0,
                endDate: 0,
            }).sort({ beginDateTime: -1 });
            return manteinanceActionResp;
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
                    "beginDateTime": dailyWork.beginDateTime,
                    "endDate": dailyWork.endDate,
                    "endDateTime": dailyWork.endDateTime,
                    "routineScheduleId": dailyWork.routineScheduleId,
                    "plantShutdownWorkId": dailyWork.plantShutdownWorkId,
                    "sector": 'Instrumentos-Sistemas',
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

    updateDailyWorkByPlantShutdownWorkId = async (id, plantShutdownWorkId) => {
        try {
            await dailyWorkModel.updateOne({ _id: id }, {
                $set: {
                    plantShutdownWorkId: plantShutdownWorkId,
                }
            });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    // lo hago como una transaccion
    deleteDailyWork = async (dailyWork) => {
        //const session = await this.conn.startSession();
        try {
            let executeSocketInApi = false;
            //session.startTransaction();
            const { id, routineScheduleId, action } = dailyWork;
            if (routineScheduleId !== "" && action === 2) {
                // si es una rutina y tiene realCheckedDay, tengo que actualizar el routineSchedule para que me permita volver a completarla.
                const routineSchedule = await this.getRoutineScheduleById(routineScheduleId, /*session*/);
                const realCheckedDay = routineSchedule[0].realCheckedDay;
                if (realCheckedDay !== null) {
                    // controlo que este expirada la rutina
                    const today = new Date();
                    const isExpired = today > routineSchedule[0].dueDate;
                    await this.updateRoutineScheduleIfDeleteDayWork(routineScheduleId, isExpired, /*session*/);
                    executeSocketInApi = isExpired ? true : false;
                }
            }
            await dailyWorkModel.deleteMany({ _id: id }, /*{ session }*/);
            //await session.commitTransaction();
            return executeSocketInApi;
        } catch (error) {
            loggerError.error(error);
            //await session.abortTransaction();
            return false;
        } finally {
            //session.endSession();
        }
    }

    getQtyStatusWorks = async (startDate, endDate, status) => {
        try {
            const dailyWorkResp = await dailyWorkModel.countDocuments({ $and: [{ "complete": status }, { "beginDateTime": { $gte: startDate } }, { "beginDateTime": { $lte: endDate } }] });
            return dailyWorkResp;
        } catch (error) {
            console.log(error)
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

    getRoutines = async () => {
        try {
            const routineResp = await routineModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 }).sort({ createdAt: -1 });
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

    getRoutineScheduleById = async (id, session = null) => {
        try {
            const routineResp = await routineScheduleModel.find({ _id: id }, { __v: 0, createdAt: 0, updatedAt: 0 },/* { session }*/);
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
            //const routineResp = await routineScheduleModel.find({ "showMonthAndYear": monthAndYear }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return routineResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateRoutineScheduleOT = async (id, ot, filePath) => {
        try {
            await routineScheduleModel.updateOne({ "_id": id }, {
                $set: {
                    "ot": ot,
                    "filePath": filePath,
                }
            });
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateRoutineScheduleByDueDate = async (dueDate) => {
        try {
            await routineScheduleModel.updateMany({ $and: [{ "dueDate": dueDate }, { "otherCheckDay": { $eq: null } }] }, {
                $set: {
                    "complete": true
                }
            });
            const updatedRoutinesSchedules = await routineScheduleModel.find({ "dueDate": dueDate }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return updatedRoutinesSchedules;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updateIsExpiredRoutineSchedule = async (id, flag) => {
        try {
            await routineScheduleModel.updateOne({ "_id": id }, {
                $set: {
                    "isExpired": flag
                }
            });
            return true;
        } catch (error) {
            loggerError.error(error)
        }
    }

    updateRoutineScheduleByCompleteTask = async (id, checkedDay) => {
        try {
            await routineScheduleModel.updateOne({ "_id": id }, {
                $set: {
                    "complete": true,
                    "realCheckedDay": checkedDay,
                    "isExpired": false
                }
            });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updateRoutineScheduleIfDeleteDayWork = async (id, isExpired, session = null) => {
        try {
            await routineScheduleModel.updateOne({ "_id": id }, {
                $set: {
                    "complete": false,
                    "realCheckedDay": null,
                    "isExpired": isExpired
                }
            },
                /*{session}*/
            );
            return true;
        } catch (error) {
            console.log(error);
            loggerError.error(error)
        }
    }

    getQtyOverdueRoutines = async () => {
        try {
            const routineResp = await routineScheduleModel.countDocuments({ $and: [{ isExpired: true }, { complete: false }] });
            return routineResp;
        } catch (error) {
            console.log(error);
            loggerError.error(error)
        }
    }

    getQtyDailyRoutines = async (weekday) => {
        try {
            const routineResp = await routineScheduleModel.countDocuments({ $and: [{ complete: false }, { checkDays: weekday }] });
            return routineResp;
        } catch (error) {
            console.log(error);
            loggerError.error(error)
        }
    }

    getQtyOtherRoutines = async (date) => {
        try {
            const routineResp = await routineScheduleModel.countDocuments({ $and: [{ complete: false }, { otherCheckDay: date }] });
            return routineResp;
        } catch (error) {
            console.log(error);
            loggerError.error(error)
        }
    }

    /* PLANT_SHUTDOWNS */

    getPlantShutdowns = async (year) => {
        try {
            const plantShutdownsResp = await plantShutdownModel.find({ $expr: { $eq: [{ "$year": "$beginDate" }, year] } }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownsResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownsUnfinished = async () => {
        try {
            const plantShutdownsResp = await plantShutdownModel.find({ $or: [{ "endDate": { $eq: null } }, { "complete": { $ne: "C" } }] }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownsResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownById = async (id) => {
        try {
            const plantShutdownsResp = await plantShutdownModel.find({ _id: id }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownsResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createPlantShutdown = async (plantShutdown) => {
        try {
            const plantShutdownResp = await plantShutdownModel.insertMany(plantShutdown);
            return plantShutdownResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updatePlantShutdown = async (plantShutdown) => {
        try {
            await plantShutdownModel.updateOne({ "_id": plantShutdown._id }, {
                $set: {
                    "name": plantShutdown.name,
                    "beginDate": plantShutdown.beginDate,
                    "endDate": plantShutdown.endDate,
                    "timeSchedule": plantShutdown.timeSchedule,
                    "description": plantShutdown.description,
                    "complete": plantShutdown.complete,
                }
            });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    deletePlantShutdown = async (plantShutdown) => {
        try {
            await plantShutdownModel.deleteOne({ "_id": plantShutdown._id });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    getQtytPlantShutdownsUnfinished = async (date) => {
        try {
            const plantShutdownsResp = await plantShutdownModel.countDocuments({ $and: [{ $or: [{ "endDate": { $eq: null } }, { "complete": { $ne: "C" } }] }, { "beginDate": { $lte: date } }] });
            return plantShutdownsResp;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getBeginDateNextPlantShutdown = async (date) => {
        try {
            const plantShutdownsResp = await plantShutdownModel.findOne({ $and: [{ $or: [{ "endDate": { $eq: null } }, { "complete": { $ne: "C" } }] }, { "beginDate": { $gt: date } }] }, { "beginDate": 1, "_id": 0 });
            return plantShutdownsResp;
        } catch (error) {
            loggerError.error(error)
        }
    }



    /* PLANT_SHUTDOWNS_WORKS */

    createPlantShutdownWork = async (plantShutdownWork) => {
        try {
            const plantShutdownWorkResp = await plantShutdownWorkModel.insertMany(plantShutdownWork);
            return plantShutdownWorkResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    getPlantShutdownWorksByPlantShutdownId = async (plantShutdownId) => {
        try {
            const plantShutdownWorksResp = await plantShutdownWorkModel.find({ "plantShutdownId": plantShutdownId }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownWorksResp;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    updatePlantShutdownWork = async (plantShutdownWork) => {
        try {
            await plantShutdownWorkModel.updateOne({ "_id": plantShutdownWork._id }, {
                $set: {
                    "tag": plantShutdownWork.tag,
                    "ot": plantShutdownWork.ot,
                    "action": plantShutdownWork.action,
                    "workToDo": plantShutdownWork.workToDo,
                    "description": plantShutdownWork.description,
                    "complete": plantShutdownWork.complete,

                }
            });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    deletePlantShutdownWork = async (plantShutdownWork) => {
        try {
            await plantShutdownWorkModel.deleteOne({ "_id": plantShutdownWork._id });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }

    /*                                                          */

    /*                        HOLIDAYS                        */

    getHolidays = async () => {
        try {
            const holidaysResp = await holidayModel.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
            return holidaysResp;
        }
        catch (error) {
            loggerError.error(error)
        }
    }

    getPerioData = async (periodId) => {
        try {
            const periodDataResp = await holidayModel.find({ "_id": periodId }, { __v: 0, createdAt: 0, updatedAt: 0 });
            return periodDataResp;
        }
        catch (error) {
            loggerError.error(error)
        }
    }

    createPeriod = async (period) => {
        try {
            await holidayModel.insertMany(period);
            return true;
        } catch (error) {
            loggerError.error(error)
            return 'duplicate'
        }
    }

    updateHolidayData = async (id, holidaysData) => {
        try {
            await holidayModel.updateOne({ "_id": id }, { $set: { holidaysData } });
            return true;
        } catch (error) {
            console.log(error)
            loggerError.error(error)
        }
    }



    deletePeriod = async (periodId) => {
        try {
            await holidayModel.deleteOne({ "_id": periodId });
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

    createDailyWorksRoutineColumns = async (columns) => {
        try {
            const dailyWorkRoutineColumns = await dailyWorkRoutineColumnModel.insertMany(columns);
            return dailyWorkRoutineColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getDailyWorksRoutineColumns = async () => {
        try {
            const dailyWorkRoutineColumns = await dailyWorkRoutineColumnModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkRoutineColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }
    deleteDailyWorksRoutineColumns = async (id) => {
        try {
            const dailyWorkRoutineColumns = await dailyWorkRoutineColumnModel.deleteMany({ _id: id });
            return dailyWorkRoutineColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createPlantShutdownsColumns = async (columns) => {
        try {
            const plantShutdownsColumns = await plantShutdownsColumnsSchemaModel.insertMany(columns);
            return plantShutdownsColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownsColumns = async () => {
        try {
            const plantShutdownsColumns = await plantShutdownsColumnsSchemaModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownsColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    deletePlantShutdownsColumns = async (id) => {
        try {
            const plantShutdownsColumns = await plantShutdownsColumnsSchemaModel.deleteMany({ _id: id });
            return plantShutdownsColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }


    createPlantShutdownWorksToDoColumns = async (columns) => {
        try {
            const plantShutdownWorkToDoColumns = await plantShutdownWorksToDoColumnsSchemaModel.insertMany(columns);
            return plantShutdownWorkToDoColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownWorksToDoColumns = async () => {
        try {
            const plantShutdownWorkToDoColumns = await plantShutdownWorksToDoColumnsSchemaModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownWorkToDoColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    deletePlantShutdownWorksToDoColumns = async () => {
        try {
            const plantShutdownWorkToDoColumns = await plantShutdownWorksToDoColumnsSchemaModel.deleteMany({});
            return plantShutdownWorkToDoColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createPlantShutdownWorksColumns = async (columns) => {
        try {
            const plantShutdownWorkColumns = await plantShutdownWorksColumnsSchemaModel.insertMany(columns);
            return plantShutdownWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownWorksColumns = async () => {
        try {
            const plantShutdownWorkColumns = await plantShutdownWorksColumnsSchemaModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return plantShutdownWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    deletePlantShutdownWorksColumns = async () => {
        try {
            const plantShutdownWorkColumns = await plantShutdownWorksColumnsSchemaModel.deleteMany({});
            return plantShutdownWorkColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createPlantShutdownDailyWorksColumns = async (columns) => {
        try {
            const dailyWorkForShutdownWorksColumns = await plantShutdowndailyWorksColumnsSchemaModel.insertMany(columns);
            return dailyWorkForShutdownWorksColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getPlantShutdownDailyWorksColumns = async () => {
        try {
            const dailyWorkForShutdownWorksColumns = await plantShutdowndailyWorksColumnsSchemaModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return dailyWorkForShutdownWorksColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    createHolidayScoreColumns = async (columns) => {
        try {
            const holidayScoreColumns = await holidayScoreColumnsModel.insertMany(columns);
            return holidayScoreColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }

    getHolidayScoreColumns = async () => {
        try {
            const holidayScoreColumns = await holidayScoreColumnsModel.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
            return holidayScoreColumns;
        } catch (error) {
            loggerError.error(error)
        }
    }







    /*          */




}


