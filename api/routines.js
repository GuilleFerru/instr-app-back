import { dao } from '../server.js';
import { ApiDailyWork } from './dailyWorks.js';
import { ApiPlant } from './plants.js';
import { ApiAttelier } from './attelieres.js';
import { ApiTimeSchedule } from './timeSchedules.js';
import { ApiManteinanceFrequency } from './manteinanceFrequencies.js';
import { ApiManteinance } from './manteinances.js';
import { ApiManteinanceAction } from './manteinanceActions.js';
import { saveRoutineDTO, routineScheduleDTO, routineRespDTO, routineRespForOthersRoutineDTO, routineSavedAsDailyWorkDTO } from '../model/DTOs/routine.js';
import { OthersRoutineColumnTable } from '../utils/otherRoutinesColumnTable.js';
import { parseStringToDate, dateInLocalDate, todayInLocalDate, monthAndYearString, getDayName } from '../utils/formatDate.js';
import { loggerError, loggerInfo } from '../utils/logger.js';

const getNicknamesForSelectForm = async () => {
    const dbNicknames = await dao.getRoutinesSchedulesNicknames();
    const dotlessNickname = dbNicknames.map(element => {
        const removeDot = element.replace(/\./g, '');
        return removeDot;
    })
    const duplicateNicknames = Array.from(new Set(dotlessNickname));
    const nicknames = duplicateNicknames.map((nickname, index) => {
        const nicknameObj = {
            id: index + 1,
            name: nickname + '.'
        }
        return nicknameObj;
    })
    //nicknames.unshift({ id: 0, name: 'Nuevo Nombre' });
    return nicknames;
}

const checkNicknameDot = (nickname) => {
    const checkNicknameDot = nickname.split('.');
    if (checkNicknameDot.length === 1) {
        nickname = nickname + '.';
    }
    return nickname;
}

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

const checkDueDate = (lastRoutineId, startDay, checkDays, otherCheckDay, frecuency, filePath, nickname, ot = '') => {

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

        const twoMonthsDateFromStartDate = new Date(startDate.setMonth(startDate.getMonth() + 2));
        const dayInMonth = daysInMonth(twoMonthsDateFromStartDate.getMonth(), twoMonthsDateFromStartDate.getFullYear());
        const dueDate = new Date(twoMonthsDateFromStartDate.getMonth() + '-' + dayInMonth + '-' + startDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 8) {

        const sixMonthsDateFromStartDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
        const dayInMonth = daysInMonth(sixMonthsDateFromStartDate.getMonth(), sixMonthsDateFromStartDate.getFullYear());
        const dueDate = new Date(sixMonthsDateFromStartDate.getMonth() + '-' + dayInMonth + '-' + sixMonthsDateFromStartDate.getFullYear());
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 9) {

        const oneYearFromStartDate = new Date(startDate.setMonth(startDate.getMonth() + 12));
        const dueDate = new Date(oneYearFromStartDate.setDate(oneYearFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);

    } else if (otherCheckDay && frecuency === 10) {

        const twoYearsFromStartDate = new Date(startDate.setMonth(startDate.getMonth() + 24));
        const dueDate = new Date(twoYearsFromStartDate.setDate(twoYearsFromStartDate.getDate() - 1));
        return routineScheduleDTO(lastRoutineId, startDay, ot, dueDate, [], checkIfWeekend(otherCheckDay), undefined, false, false, filePath, nickname);
    }

}

const otherRoutineResp = (otherRoutines, columns, date) => {
    const otherRoutineResp = { otherRoutines, columns, date };
    return otherRoutineResp;
}

const getRoutines = async (routineSchedules, filter) => {
    const routinesId = [];
    const routines = [];
    const savedRoutines = await dao.getRoutines();

    if (routineSchedules !== undefined) {
        routineSchedules.map(element => {
            routinesId.push({ _id: element._id, routineId: element.routine, complete: element.complete, ot: element.ot, nickname: element.nickname, filePath: element.filePath, checkDay: element.otherCheckDay, weekCheckDays: element.checkDays, realCheckedDay: element.realCheckedDay });
        });
    }
    for (const element of routinesId) {
        const routine = savedRoutines.find(({ _id }) => _id.toString() === element.routineId);
        //const routine = await dao.getRoutine(element.routineId);
        if (filter === 'forRoutines') {
            const routineRes = routineRespForOthersRoutineDTO(routine, element.complete, element._id, element.ot, element.filePath, element.nickname, element.checkDay, element.weekCheckDays, element.realCheckedDay);
            routines.push(routineRes);
        } else if (filter === 'forDailyWorks') {
            const routineRes = routineRespDTO(routine, element.complete, element._id, element.ot);
            routines.push(routineRes);
        }
    }
    return routines;
}

export class ApiRoutine {

    handleSocket = async (...data) => {
        try {
            const { date, socket, action, routineData, io } = data[0];
            if (action === 'get_qtyOverDueRoutines') {
                const data = await this.getQtyOverdueRoutines();
                io.emit('get_qtyOverDueRoutines', data);
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    createRoutine = async (routine) => {
        try {
            const { plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description, checkDays, otherCheckDay, startDay, filePath, nickname } = routine;
            const newRoutine = saveRoutineDTO(plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description);
            const lastRoutine = await dao.createRoutine(newRoutine);
            const lastRoutineId = lastRoutine[0]._id;
            const newRoutineSchedule = checkDueDate(lastRoutineId, startDay, checkDays, new Date(otherCheckDay), frecuency, filePath, checkNicknameDot(nickname));
            await dao.createRoutineSchedule(newRoutineSchedule);
            return true;
        } catch (err) {
            loggerError.error(err);
            return false
        } finally {
            loggerInfo.info('createRoutine');
        }
    }

    createRoutineScheduleByNewMonth = async () => {
        const today = todayInLocalDate();
        const dueDate = addDays(today, -2);
        //const completeRoutineSchedules = await dao.updateRoutineScheduleByDueDate(dueDate);
        
        for (const routineSchedule of completeRoutineSchedules) {
            const startDate = addDays(dueDate, 1)
            const routine = await dao.getRoutine(routineSchedule.routine);
            if (routine[0].active) {
                const newRoutineSchedule = checkDueDate(routineSchedule.routine, startDate, routineSchedule.checkDays, routineSchedule.otherCheckDay, routine[0].frecuency, '', routineSchedule.nickname);
                //routineSchedule.complete === false && await dao.updateIsExpiredRoutineSchedule(routineSchedule._id, true);
                //await dao.createRoutineSchedule(newRoutineSchedule);
            }
        }
    }

    getRoutine = async (date) => {
        try {
            //busca las rutinas que se deben realizar dentro de la semana.
            const weekDay = new Date(date).getDay();
            const actualMonthRoutineSchedule = await dao.getActualMonthRoutineSchedule(weekDay);
            return await getRoutines(actualMonthRoutineSchedule, 'forDailyWorks');
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
            if (allRoutines.length > 0) {
                const monthAndYear = monthAndYearString(localDate);
                return otherRoutineResp(allRoutines, ...columns, monthAndYear);
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getDataForRoutineCrud = async () => {
        try {
            const plants = await ApiPlant.getPlantsForSelectForm();
            const attelieres = await ApiAttelier.getAttelieresForSelectForm();
            const timeSchedules = await ApiTimeSchedule.getTimeScheduleForSelectForm();
            const frequencies = await ApiManteinanceFrequency.getManteinanceFrequencyForSelectForm();
            const manteinances = await ApiManteinance.getManteinancesForSelectForm();
            const actions = await ApiManteinanceAction.getManteinanceActionsForSelectForm();
            const nicknames = await getNicknamesForSelectForm();
            const rawTags = await dao.getRoutinesTags();
            const orderedRawTags = rawTags.sort((a, b) => (a.tag > b.tag) ? 1 : ((b.tag > a.tag) ? -1 : 0));
            const tags = orderedRawTags.map(tag => {
                tag = {
                    id: tag._id,
                    name: tag.tag
                }
                return tag;
            });
            const data = { plants, attelieres, timeSchedules, frequencies, manteinances, actions, nicknames, tags };
            return data;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getDataForRoutineEdit = async (routineId) => {
        try {
            if (routineId) {
                const routineFromDB = await dao.getRoutine(routineId);
                const routineSchedule = await dao.getLastRoutineScheduleByRoutineId(routineId);

                if (routineSchedule.length > 0) {
                    routineSchedule[0].checkDays = routineSchedule[0].checkDays.map((day) => {
                        return { id: day, name: getDayName(day) }
                    });
                }
                const routine = {
                    routineId: routineFromDB[0]._id,
                    routineScheduleId: routineSchedule.length > 0 ? routineSchedule[0]._id : '',
                    nickname: routineSchedule.length > 0 ? routineSchedule[0].nickname : '',
                    plant: routineFromDB[0].plant,
                    attelier: routineFromDB[0].attelier,
                    tag: routineFromDB[0].tag,
                    timeSchedule: routineFromDB[0].timeSchedule,
                    frecuency: routineFromDB[0].frecuency,
                    manteinance: routineFromDB[0].manteinance,
                    action: routineFromDB[0].action,
                    description: routineFromDB[0].description,
                    checkDays: routineSchedule.length > 0 ? routineSchedule[0].checkDays : [],
                    otherCheckDay: routineSchedule.length > 0 ? routineSchedule[0].otherCheckDay : null,
                    startDay: routineSchedule.length > 0 ? routineSchedule[0].startDate : null,
                    active: routineFromDB[0].active,
                    ot: routineSchedule.length > 0 ? routineSchedule[0].ot : '',
                    complete: routineSchedule.length > 0 ? routineSchedule[0].complete : true,
                }
                return routine;
            } else {
                return [];
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    updateRoutine = async (routine) => {
        try {
            const { plant, attelier, tag, timeSchedule, active, frecuency, manteinance, action, description, checkDays, otherCheckDay, startDay, filePath, nickname, routineId, routineScheduleId, complete, ot } = routine;
            const newRoutine = saveRoutineDTO(plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description, active);
            const newRoutineSchedule = checkDueDate(routineId, new Date(startDay), checkDays, new Date(otherCheckDay), frecuency, filePath, checkNicknameDot(nickname), ot);
            await dao.updateRoutine(routineId, newRoutine);
            !complete && await dao.updateRoutineSchedule(routineScheduleId, newRoutineSchedule);
            return true;
        } catch (err) {
            loggerError.error(err);
            return false;
        } finally {
        }
    }

    getQtyOverdueRoutines = async () => {
        try {
            const overdueRoutines = await dao.getQtyOverdueRoutines();
            return overdueRoutines;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getRoutinesForWidgetDashboard = async (date) => {
        try {
            const weekDay = new Date(date).getDay();
            const qtyDailyRoutines = await dao.getQtyDailyRoutines(weekDay);
            const qtyOtherRoutines = await dao.getQtyOtherRoutines(date);
            const qtyOverdueRoutines = await dao.getQtyOverdueRoutines();
            const dashboardRoutines = [qtyDailyRoutines, qtyOtherRoutines, qtyOverdueRoutines];
            return dashboardRoutines;
        } catch (err) {
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
            return true;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('');
        }
    }

    updateRoutineScheduleOT = async (routineSchedule) => {
        try {
            const updatedRoutineScheduleOT = await dao.updateRoutineScheduleOT(routineSchedule.id, routineSchedule.ot, routineSchedule.filePath);
            if (updatedRoutineScheduleOT) {
                const updateResp = await dao.updateDailyWorkRoutineOtBySchedRoutineId(routineSchedule.id, routineSchedule.ot);
                return updateResp;
            } else {
                return false;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    createMonthRoutine = async() => {
        try {

            const today = todayInLocalDate();
            const dueDate = addDays(today, -2);
            //const completeRoutineSchedules = await dao.updateRoutineScheduleByDueDate(dueDate);
            
            // for (const routineSchedule of completeRoutineSchedules) {
            //     const startDate = addDays(dueDate, 1)
            //     const routine = await dao.getRoutine(routineSchedule.routine);
            //     if (routine[0].active) {
            //         const newRoutineSchedule = checkDueDate(routineSchedule.routine, startDate, routineSchedule.checkDays, routineSchedule.otherCheckDay, routine[0].frecuency, '', routineSchedule.nickname);
            //         routineSchedule.complete === false && await dao.updateIsExpiredRoutineSchedule(routineSchedule._id, true);
            //         await dao.createRoutineSchedule(newRoutineSchedule);
            //     }
            // }

            console.log('llegue', today, dueDate)
        } catch (err) {
            loggerError.error(err)
        }
    }
}
