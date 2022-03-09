import { dao } from '../server.js';
import { formatDate, todayInLocalDate, dateInLocalDate } from '../utils/formatDate.js';
import { ApiRoutine } from './routines.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { saveDailyWorkDTO, updateDayWorkDTO, completedDailyWorkDTO } from '../model/DTOs/dailyWork.js';
import { loggerError, loggerInfo } from '../utils/logger.js';


const apiRoutine = new ApiRoutine();

const worksResp = (dayWorks, columns) => {
    const worksResp = { dayWorks, columns };
    return worksResp;
}

export class ApiDailyWork {

    createDailyWork = async (data, filter) => {
        try {
            const dayWorks = [];
            if (filter !== 'fromRoutine') {
                dayWorks.push(saveDailyWorkDTO(data))


                console.log(dayWorks);
            } else {
                dayWorks.push(...data)
            }
            await dao.createDailyWork(...dayWorks);
            // return dayWorks;
        } catch (err) {
            console.log(err);
            loggerError.error(err);
        } finally {
            loggerInfo.info('createDailyWork');
        }
    }

    getDailyWork = async (date) => {
        try {
            const columns = [];
            const savedColumns = await ApiDailyWorksColumnTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await ApiDailyWorksColumnTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }
            const dateLocalString = formatDate(date);
            const dayWorks = await dao.getDailyWork(dateLocalString);
            if (dayWorks.length === 0) {
                const routines = await apiRoutine.getRoutine(date);
                const dayWorks = [];
                routines.map(routine => { dayWorks.push(saveDailyWorkDTO(routine, dateLocalString)) });
                const currentMonth = todayInLocalDate().getMonth() + 1;
                const dateMonth = dateInLocalDate(date).getMonth() + 1;
                currentMonth === dateMonth && await dao.createDailyWork(dayWorks);
                return worksResp(dayWorks, ...columns);
            } else {
                return worksResp(dayWorks, ...columns);
            }
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }


    updateDailyWork = async (date, dayWork) => {
        try {
            const dateLocal = formatDate(date);
            if (dateLocal && dayWork) {
                const dailyWork = updateDayWorkDTO(dayWork);
                //si es una rutina y tiene OT guardo la OT en routineSchedule
                const routineOT = dailyWork.action === 2 && dailyWork.ot != '' ? dailyWork.ot : false;
                if (routineOT) {
                    const routineScheduleId = dayWork.routineScheduleId;
                    await dao.updateRoutineScheduleOT(routineScheduleId, routineOT);
                }
                const today = formatDate(todayInLocalDate());
                const dailyWorkToUpdate = completedDailyWorkDTO(dayWork, today)
                const resultado = await dao.updateDailyWork(dateLocal, dailyWorkToUpdate);
                if (resultado) {
                    return resultado;
                } else {
                    return false;
                }
            }
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    deleteDailyWork = async (id) => {
        try {
            await dao.deleteDailyWork(id);
            return dayWorks;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('deleteDailyWork');
        }
    }
}
