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
            if (filter !== 'fromRoutine') {
                return await dao.createDailyWork(saveDailyWorkDTO(data));
            } else {
                return await dao.createDailyWork(data);
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createDailyWork');
        }
    }

    getDailyWork = async (date) => {
        try {
            // busca la tabla de trabajo diario y guarda las columnas en columns, sino existe la crea.
            const columns = [];
            const savedColumns = await ApiDailyWorksColumnTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await ApiDailyWorksColumnTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }
            // busca los trabajos diarios de la fecha que viene en date
            const dateLocalString = formatDate(date);
            const dayWorks = await dao.getDailyWork(dateLocalString);
            /*si no hay trabajos diarios, busca todas las rutinas y las crea como trabajos diarios, 
            sino va a devolver las rutinas creadas la primera vez y los trabajos diarios */
            if (dayWorks.length === 0) {
                const routines = await apiRoutine.getRoutine(date);
                const dayWorks = [];
                routines !== undefined && routines.map(routine => { dayWorks.push(saveDailyWorkDTO(routine, dateLocalString)) });
                /*como la rutina esta asociada a una rutinaSchedule y tiene una fecha de incio y fin, 
                creo el dailyWork solo si el mes del date coincide con el mes actual, 
                sino la traigo y la muestro sin OT y sin guardar en dailyWork */
                const currentMonth = todayInLocalDate().getMonth() + 1;
                const dateMonth = dateInLocalDate(date).getMonth() + 1;
                currentMonth === dateMonth && await dao.createDailyWork(dayWorks);
                currentMonth !== dateMonth && dayWorks.map(work => { work.ot = '' });
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

    getDailyWorkRoutine = async (routineScheduleId) => {
        try {
            const dailyWorksRoutines = await dao.getDailyWorkRoutine(routineScheduleId);
            return dailyWorksRoutines;
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
