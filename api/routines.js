import { dao } from '../server.js';
import { ApiDailyWork } from './dailyWorks.js';
import { saveRoutineDTO, routineScheduleDTO, routineRespDTO, routineRespForOthersRoutineDTO, routineSavedAsDailyWorkDTO } from '../model/DTOs/routine.js';
import { OthersRoutineColumnTable } from '../utils/otherRoutinesColumnTable.js';
import { parseStringToDate, dateInLocalDate, todayInLocalDate } from '../utils/formatDate.js';
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
    dayNumber === 0 ? weekDay = addDays(day, -2) : dayNumber === 6 ? weekDay = addDays(day, -1) : weekDay = date;
    return weekDay;
}

const checkDueDate = (lastRoutineId, startDay, checkDays, otherCheckDay, frecuency, filePath, nickname) => {

    const ot = '';
    const startDate = new Date(startDay);
    let dayInMonth = daysInMonth(startDate.getMonth() + 1, startDate.getFullYear());

    if (checkDays.length > 0) {

        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, '', undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 5) {

        const dayForDueDate = parseInt(dayInMonth / 2);
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayForDueDate + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 6) {

        const generateOtherCheckDay = new Date((otherCheckDay.getMonth() + 2) + '-' + otherCheckDay.getDate() + '-' + otherCheckDay.getFullYear());
        const newOtherCheckDay = checkIfWeekend(generateOtherCheckDay);
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());

        if (generateOtherCheckDay.getMonth() === newOtherCheckDay.getMonth()) {
            return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], newOtherCheckDay, undefined, false, false, filePath, nickname);
        } else {
            return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], null, undefined, false, false, filePath, nickname);
        }

    } else if (otherCheckDay && frecuency === 7) {

        const dayInMonth = daysInMonth(startDate.getMonth() + 2, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 2) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 8) {

        const dayInMonth = daysInMonth(startDate.getMonth() + 6, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 6) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 9) {

        const oneYearFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 1)));
        const dueDate = new Date(oneYearFromStartDate.setDate(oneYearFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 10) {

        const twoYearsFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 2)));
        const dueDate = new Date(twoYearsFromStartDate.setDate(twoYearsFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);
    }

}

const otherRoutineResp = (otherRoutines, columns) => {
    const otherRoutineResp = { otherRoutines, columns };
    return otherRoutineResp;
}

const getRoutines = async (routineSchedules, filter) => {
    const routinesId = [];
    const routines = [];

    if (routineSchedules !== undefined) {
        routineSchedules.map(element => {
            routinesId.push({ _id: element._id, routineId: element.routine, complete: element.complete, ot: element.ot, nickname: element.nickname, filePath: element.filePath, checkDay: element.otherCheckDay, weekCheckDays: element.checkDays, realCheckedDay: element.realCheckedDay });
        });
    }
    for (const element of routinesId) {
        const routine = await dao.getRoutine(element.routineId);
        // const routineFrecuency = routine[0].frecuency;
        if (filter === 'forRoutines') {
            const routineRes = routineRespForOthersRoutineDTO(routine[0], element.complete, element._id, element.ot, element.filePath, element.nickname, element.checkDay, element.weekCheckDays, element.realCheckedDay);
            routines.push(routineRes);
        } else if (filter === 'forDailyWorks') {
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

    createRoutineScheduleByNewMonth = async () => {
        const today = todayInLocalDate();
        const dueDate = addDays(today, -1);
        const completeRoutineSchedules = await dao.updateRoutineScheduleByDueDate(dueDate);
        for (const routineSchedule of completeRoutineSchedules) {
            const startDate = addDays(dueDate, 1)
            const routine = await dao.getRoutine(routineSchedule.routine);
            const newRoutineSchedule = checkDueDate(routineSchedule.routine, startDate, routineSchedule.checkDays, routineSchedule.otherCheckDay, routine[0].frecuency, '', routineSchedule.nickname);
            routineSchedule.complete === false && await dao.updateIsExpiredRoutineSchedule(routineSchedule._id, true);
            await dao.createRoutineSchedule(newRoutineSchedule);
        }
    }

    getRoutine = async (date) => {
        try {
            //busca las rutinas que se deben realizar dentro de la semana.
            const weekDay = new Date(date).getDay();
            const actualMonthRoutineSchedule = await dao.getActualMonthRoutineSchedule(weekDay);
            return await getRoutines(actualMonthRoutineSchedule, 'forDailyWorks');
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    getAllRoutine = async (date) => {
        try {

            const localDate = dateInLocalDate(date);

            //const monthAndYear = (localDate.getMonth() +1) + '-' + localDate.getFullYear();

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
            if (allRoutines.length > 0) {
                return otherRoutineResp(allRoutines, ...columns);
            }
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    updateRoutineScheduleByCompleteTask = async (data) => {
        try {
            //busco la rutina asociada al schedule de la rutina
            const routine = await dao.getRoutine(data.routineId);
            //ahora creo el objeto para guardar la rutina como un dailyWork
            const routineSavedAsDailyWork = routineSavedAsDailyWorkDTO(routine[0], data);
            // update el routineSchedule
            const id = data.id;
            const checkedDay = parseStringToDate(routineSavedAsDailyWork.endDate);
            const updatedDone = await dao.updateRoutineScheduleByCompleteTask(id, checkedDay);
            // update el dailyWork
            if (updatedDone) {
                const apiDailyWork = new ApiDailyWork();
                await apiDailyWork.createDailyWork(routineSavedAsDailyWork, 'fromRoutine');
            }
            // const dataToDailyWork = [];

            // for (const routineFromClient of data) {
            //     const routine = await dao.getRoutine(routineFromClient.routineId);
            //     const routineSavedAsDailyWork = routineSavedAsDailyWorkDTO(routine[0], routineFromClient);
            //     dataToDailyWork.push(routineSavedAsDailyWork);

            //     const id = routineFromClient._id;
            //     const checkedDay = parseStringToDate(routineSavedAsDailyWork.endDate);
            //     await dao.updateRoutineScheduleByCompleteTask(id, checkedDay);
            // }
            // ahora tengo que crear el dailyWork en el dia que se cerro la routineSchedule
            // const apiDailyWork = new ApiDailyWork();
            // await apiDailyWork.createDailyWork(dataToDailyWork, 'fromRoutine');
            // por ultimo updateo la rutina
            return true;
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
            loggerInfo.info('');
        }
    }

    updateRoutineScheduleOT = async (routineSchedule) => {
        try {
            const updatedRoutineScheduleOT = await dao.updateRoutineScheduleOT(routineSchedule.id, routineSchedule.ot, routineSchedule.filePath);
            return updatedRoutineScheduleOT;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('');
        }
    }
}
