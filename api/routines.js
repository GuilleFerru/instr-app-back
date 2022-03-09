import { dao } from '../server.js';
import { ApiDailyWork } from './dailyWorks.js';
import { saveRoutineDTO, routineScheduleDTO, routineRespDTO, routineRespForOthersRoutineDTO, routineSavedAsDailyWorkDTO } from '../model/DTOs/routine.js';
import { OthersRoutineColumnTable } from '../utils/otherRoutinesColumnTable.js';
import { formatDate, dateInLocalDate, todayInLocalDate } from '../utils/formatDate.js';
import { loggerError, loggerInfo } from '../utils/logger.js';




const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const checkIfWeekend = (date) => {
    const day = new Date(date);
    const dayNumber = day.getDay();
    let weekDay;
    dayNumber === 0 ? weekDay = addDays(day, 1) : dayNumber === 6 ? weekDay = addDays(day, 2) : weekDay = date;
    return weekDay;
}

const checkDueDate = (lastRoutineId, startDay, checkDays, otherCheckDay, frecuency, filePath, nickname) => {

    const ot = '';
    const startDate = new Date(startDay);
    let dayInMonth = daysInMonth(startDate.getMonth() + 1, startDate.getFullYear());

    if (checkDays) {
        const otherCheckDay = '';
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 5) {
        const checkDays = [];
        const dayForDueDate = parseInt(dayInMonth / 2);
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayForDueDate + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 6) {
        const checkDays = [];
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 7) {
        const checkDays = [];
        const dayInMonth = daysInMonth(startDate.getMonth() + 2, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 2) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 8) {
        const checkDays = [];
        const dayInMonth = daysInMonth(startDate.getMonth() + 6, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 6) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 9) {
        const checkDays = [];
        const oneYearFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 1)));
        const dueDate = new Date(oneYearFromStartDate.setDate(oneYearFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    } else if (otherCheckDay && frecuency === 10) {
        const checkDays = [];
        const twoYearsFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 2)));
        const dueDate = new Date(twoYearsFromStartDate.setDate(twoYearsFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, checkIfWeekend(otherCheckDay), false, false, filePath, nickname);
    }

}

const otherRoutineResp = (otherRoutines, columns) => {
    const otherRoutineResp = { otherRoutines, columns };
    return otherRoutineResp;
}

const getRoutines = async (routineSchedules, filter) => {
    const routinesId = [];
    const routines = []

    if (routineSchedules !== undefined) {
        routineSchedules.map(element => {
            routinesId.push({ _id: element._id, routineId: element.routine, complete: element.complete, ot: element.ot, nickname: element.nickname, filePath: element.filePath, checkDay: element.otherCheckDay, weekCheckDays: element.checkDays });
        });
    }
    for (const element of routinesId) {
        const routine = await dao.getRoutine(element.routineId);
        // const routineFrecuency = routine[0].frecuency;
        if (filter === 'forRoutines') {
            const routineRes = routineRespForOthersRoutineDTO(routine[0], element.complete, element._id, element.ot, element.filePath, element.nickname, element.checkDay, element.weekCheckDays);
            routines.push(routineRes);
        } else {
            const routineRes = routineRespDTO(routine[0], element.complete, element._id, element.ot);
            routines.push(routineRes);
        }
    }
    return routines;
}


export class ApiRoutine {

    createRoutine = async (routine) => {
        try {
            const { plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description, checkDays, otherCheckDay, startDay, filePath, nickname } = routine;
            const newRoutine = saveRoutineDTO(plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description);
            const lastRoutine = await dao.createRoutine(newRoutine);
            const lastRoutineId = lastRoutine[0]._id;
            const newRoutineSchedule = checkDueDate(lastRoutineId, startDay, checkDays, otherCheckDay, frecuency, filePath, nickname);
            await dao.createRoutineSchedule(newRoutineSchedule);
            return true;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createRoutine');
        }
    }

    getRoutine = async (date) => {
        try {

            const weekDay = new Date(date).getDay();
            const today = todayInLocalDate();
            const actualMonthRoutineSchedule = await dao.getActualMonthRoutineSchedule(weekDay);

            //me actualiza la OT cuando 
            // for (const actualRoutine of actualMonthRoutineSchedule) {
            //     if (actualRoutine.ot !== '') {
            //         await dao.updateDailyWorkRoutineOtBySchedRoutineId(actualRoutine.routine, actualRoutine.ot);
            //         console.log(actualRoutine);
            //     }
            // }

            const actualRoutineScheduleDates = actualMonthRoutineSchedule.map(routine => { return { dueDate: routine.dueDate } });
            const dueDate = actualRoutineScheduleDates[0].dueDate;

            if (today > dueDate) {
                const completeRoutineSchedules = await dao.updateRoutineScheduleByDueDate(dueDate);
                for (const routineSchedule of completeRoutineSchedules) {
                    const startDate = addDays(dueDate, 1)
                    const routine = await dao.getRoutine(routineSchedule.routine);
                    const newRoutineSchedule = checkDueDate(routineSchedule.routine, startDate, routineSchedule.checkDays, routineSchedule.otherCheckDay, routine[0].frecuency);
                    await dao.createRoutineSchedule(newRoutineSchedule);
                }
            }
            const routines = await getRoutines(actualMonthRoutineSchedule, 'forDailyWorks');
            return routines
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getAllRoutine = async (date) => {
        try {
            const localDate = dateInLocalDate(date);
            const routinesSchedules = await dao.getAllRoutinesSchedules(localDate);
            const allRoutines = await getRoutines(routinesSchedules, 'forRoutines');

            const columns = [];
            const savedColumns = await OthersRoutineColumnTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await OthersRoutineColumnTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }
            return otherRoutineResp(allRoutines, ...columns);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    updateRoutineScheduleByCompleteTask = async (data) => {
        try {
            //actualizo la routineSchedule

            const dataToDailyWork = [];

            for (const routineSchedule of data) {
                const routine = await dao.getRoutine(routineSchedule.routineId);
                const routineSavedAsDailyWork = routineSavedAsDailyWorkDTO(routine[0], routineSchedule)
                dataToDailyWork.push(routineSavedAsDailyWork)
            }

            // ahora tengo que crear el dailyWork en el dia que se cerro la routineSchedule
            const apiDailyWork = new ApiDailyWork();
            await apiDailyWork.createDailyWork(dataToDailyWork, 'fromRoutine');
            // por ultimo updateo la rutina
            const updateCompleteRoutine = await dao.updateRoutineScheduleByCompleteTask(data);
            return updateCompleteRoutine;
        } catch (err) {
            console.log(err);
            loggerError.error(err);
        } finally {
            loggerInfo.info('');
        }
    }
}
