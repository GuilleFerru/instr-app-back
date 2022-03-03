import { dao } from '../server.js'
import { saveRoutineDTO, routineScheduleDTO, routineRespDTO } from '../model/DTOs/routine.js';
import { formatDate, parseStringToDate, dateInLocalDate, todayInLocalDate } from '../utils/formatDate.js';
import { loggerError, loggerInfo } from '../utils/logger.js';



const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const checkDueDate = (lastRoutineId, startDay, checkDays, otherCheckDay, frecuency) => {

    const ot = '';
    const startDate = new Date(startDay);
    let dayInMonth = daysInMonth(startDate.getMonth() + 1, startDate.getFullYear());

    if (checkDays) {
        const otherCheckDay = '';
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);
    } else if (otherCheckDay && frecuency === 5) {
        const checkDays = [];
        const dayForDueDate = parseInt(dayInMonth / 2);
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayForDueDate + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);
    } else if (otherCheckDay && frecuency === 6) {
        const checkDays = [];
        const dueDate = new Date((startDate.getMonth() + 1) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);
    } else if (otherCheckDay && frecuency === 7) {
        const checkDays = [];
        const dayInMonth = daysInMonth(startDate.getMonth() + 2, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 2) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);
    } else if (otherCheckDay && frecuency === 8) {
        const checkDays = [];
        const dayInMonth = daysInMonth(startDate.getMonth() + 6, startDate.getFullYear());
        const dueDate = new Date((startDate.getMonth() + 6) + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);
    } else if (otherCheckDay && frecuency === 9) {
        const checkDays = [];
        const oneYearFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 1)));
        const dueDate = new Date(oneYearFromStartDate.setDate(oneYearFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);

    } else if (otherCheckDay && frecuency === 10) {
        const checkDays = [];
        const twoYearsFromStartDate = new Date((startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear(startDate.setFullYear(startDate.getFullYear() + 2)));
        const dueDate = new Date(twoYearsFromStartDate.setDate(twoYearsFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, checkDays, otherCheckDay, false, false);

    }

}

const allEqual = arr => arr.every(val => val === arr[0]);

export class ApiRoutine {

    createRoutine = async (routine) => {
        try {
            const { plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description, checkDays, otherCheckDay, startDay } = routine;
            const newRoutine = saveRoutineDTO(plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description);
            const lastRoutine = await dao.createRoutine(newRoutine);
            const lastRoutineId = lastRoutine[0]._id;
            const newRoutineSchedule = checkDueDate(lastRoutineId, startDay, checkDays, otherCheckDay, frecuency);
            await dao.createRoutineSchedule(newRoutineSchedule);
            return true;
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
            loggerInfo.info('createRoutine');
        }
    }

    getRoutine = async (date) => {
        try {
            
            const routinesId = [];
            const weekDay = new Date(date).getDay();
            const today = todayInLocalDate();
            
            const actualMonthRoutineSchedule = await dao.getActualMonthRoutineSchedule(weekDay);

            const actualRoutineScheduleDates = actualMonthRoutineSchedule.map(routine => {
                return {
                    startDate: routine.startDate,
                    dueDate: routine.dueDate,
                }
            });
            const startDate = actualRoutineScheduleDates[0].startDate;
            const dueDate = actualRoutineScheduleDates[0].dueDate;


            if (today > dueDate) {
                const completeRoutineSchedules = await dao.updateRoutineScheduleComplete(dueDate);
                for (const routineSchedule of completeRoutineSchedules) {
                    const startDate = dueDate.addDays(1)
                    const routine = await dao.getRoutine(routineSchedule.routine);
                    console.log(routine[0].frecuency)
                    const newRoutineSchedule = checkDueDate(routineSchedule.routine, startDate, routineSchedule.checkDays, routineSchedule.otherCheckDay, routine[0].frecuency);
                    await dao.createRoutineSchedule(newRoutineSchedule);
                }
            } else {
                const actualMonthRoutineSchedule = await dao.getActualMonthRoutineSchedule(weekDay);
                if (actualMonthRoutineSchedule !== undefined) {
                    actualMonthRoutineSchedule.map(element => {
                        routinesId.push({ _id: element._id, routineId: element.routine, complete: element.complete, ot: element.ot });
                    });
                }
            }

            const routines = []
            for (const element of routinesId) {
                const routine = await dao.getRoutine(element.routineId);
                const routineRes = routineRespDTO(routine[0], element.complete, element._id, element.ot);
                routines.push(routineRes);
            }

            return routines
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }
}
