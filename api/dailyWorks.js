import { dao, io } from '../server.js';
import { formatDate, todayInLocalDate, dateInLocalDate, parseStringToDate } from '../utils/formatDate.js';
import { ApiRoutine } from './routines.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { DailyWorksRoutineTable } from '../utils/dailyWorksRoutineTable.js';
import { PlantShutdownWorksToDoColumnTable } from '../utils/plantShutdownWorksToDoTable.js';
import { saveDailyWorkDTO, updateDayWorkDTO, completedDailyWorkDTO, dailyWorkRoutineRespDTO, changeIDForViewDTO, changeViewForPlantShutdonWorksToDoDTO } from '../model/DTOs/dailyWork.js';
import { loggerError, loggerInfo } from '../utils/logger.js';


const apiRoutine = new ApiRoutine();

export const worksResp = (dayWorks, columns) => {
    const worksResp = { dayWorks, columns };
    return worksResp;
}

export const getDailyWorkTable = async (filter) => {
    const columns = [];
    let savedColumns = [];

    if (filter === 'fromDailyWork') {
        savedColumns = await ApiDailyWorksColumnTable.getColumns();
        if (savedColumns.length === 0) {
            savedColumns = await ApiDailyWorksColumnTable.createColumns();
        }
    } else if (filter === 'fromPlantShutdownWorksToDo') {
        savedColumns = await PlantShutdownWorksToDoColumnTable.getColumns();
        if (savedColumns.length === 0) {
            savedColumns = await PlantShutdownWorksToDoColumnTable.createColumns();
        }
    } else {
        savedColumns = await DailyWorksRoutineTable.getColumns();
        if (savedColumns.length === 0) {
            savedColumns = await DailyWorksRoutineTable.createColumns();
        }
    }
    columns.push(savedColumns[0].columns);
    return columns;

}

export class ApiDailyWork {


    handleSocket = async (...data) => {
        try {
            const { date, socket, action, dailyWorkData, roomId, io } = data[0];

            if (action === 'get_daily_works') {
                const data = await this.getDailyWork(date);
                data && socket.emit('get_daily_works', data);
            } else if (action === 'create_daily_work') {
                const data = await this.createDailyWork(dailyWorkData, '');
                console.log('data', data);
                data && io.to(roomId).emit('get_daily_works', await this.getDailyWork(dailyWorkData.beginDate));
            } else if (action === 'update_daily_work') {
                const data = await this.updateDailyWork(date, dailyWorkData);
                data && io.to(roomId).emit('get_daily_works', await this.getDailyWork(date));
            } else if (action === 'bulk_update_daily_work') {
                dailyWorkData.forEach(async (dailyWork) => await this.updateDailyWork(date, dailyWork));
                socket.to(roomId).emit('get_daily_works', await this.getDailyWork(date));
            } else if (action === 'delete_daily_work') {
                await this.deleteDailyWork(dailyWorkData, socket);
                io.to(roomId).emit('get_daily_works', await this.getDailyWork(date));
            } else if (action === 'get_daily_works_for_plant_shutdown') {
                const data = await this.getDailyWorkForPlantShutdown();
                data && socket.emit('get_daily_works_for_plant_shutdown', data);
            }
        } catch (error) {
            console.log(error);
            loggerError.error(error);
        }
    }

    createDailyWork = async (data, filter) => {
        try {
            if (filter === 'fromRoutine') {
                return await dao.createDailyWork(data);
            } else if (filter === 'fromPlantShutdownWork') {
                // controla que haya rutinas de ese dia, sino las hay, las crea.
                const createDayRoutines = await this.getDailyWork(parseStringToDate(data.beginDate));
                if (createDayRoutines.dayWorks.length > 0) {
                    return await dao.createDailyWork(data);
                }
            } else {
                await dao.createDailyWork(saveDailyWorkDTO(data));
                return true
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createDailyWork');
        }
    }

    getDailyWork = async (date) => {
        try {
            const dayWorks = [];
            // busca la tabla de trabajo diario y guarda las columnas en columns, sino existe la crea.
            const columns = await getDailyWorkTable('fromDailyWork');
            // busca los trabajos diarios de la fecha que viene en date
            const dateLocalString = formatDate(date);
            const rawWorks = await dao.getDailyWork(dateLocalString);
            rawWorks.map((work) => { dayWorks.push(changeIDForViewDTO(work)) });
            //console.log('dayWorks', dayWorks);
            /*si no hay trabajos diarios, busca todas las rutinas y las crea como trabajos diarios, 
            sino va a devolver las rutinas creadas la primera vez y los trabajos diarios */
            if (dayWorks.length === 0) {
                const routines = await apiRoutine.getRoutine(date);
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
            // busca la tabla de trabajo diario y guarda las columnas en columns, sino existe la crea.
            const columns = await getDailyWorkTable('fromRoutine');
            const dailyWorksRoutines = await dao.getDailyWorkRoutine(routineScheduleId);
            const sortedDailyWorkRoutine = dailyWorksRoutines.sort((a, b) => parseStringToDate(a.beginDate) - parseStringToDate(b.beginDate));
            const sortedDailyWorkRoutineResp = [];

            sortedDailyWorkRoutine.map(dailyWorkRoutine => {
                const dailyWorkRoutineResp = dailyWorkRoutineRespDTO(dailyWorkRoutine);
                sortedDailyWorkRoutineResp.push(dailyWorkRoutineResp);
            })
            return worksResp(sortedDailyWorkRoutineResp, ...columns);
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    getDailyWorkSearchBy = async (value) => {
        try {
            const columns = await getDailyWorkTable('fromDailyWork');
            columns[0][1].hidden = false;
            columns[0][8].width = '10%';
            columns[0][9].width = '25%';
            //delete columns[0][6].defaultGroupOrder
            const dayWorks = await dao.getDailyWorkSearchBy(value);
            return worksResp(dayWorks, ...columns);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getDailyWorkForPlantShutdown = async () => {
        try {
            const dailyWorksForPlantShutdown = [];
            const columns = await getDailyWorkTable('fromPlantShutdownWorksToDo');
            const rawDailyWorksForPlantShutdown = await dao.getDailyWorkForPlantShutdown();

            rawDailyWorksForPlantShutdown.map(dailyWorkForPlantShutdown => { dailyWorksForPlantShutdown.push(changeViewForPlantShutdonWorksToDoDTO(dailyWorkForPlantShutdown)) });
            return worksResp(dailyWorksForPlantShutdown, ...columns);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getDailyWorkByPlantShutdownWorkId = async (plantShutdownWorkId) => {
        try {
            const dailyWork = await dao.getDailyWorkByPlantShutdownWorkId(plantShutdownWorkId);
            return dailyWork;
        } catch (err) {
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
                const dailyWorkToUpdate = completedDailyWorkDTO(dayWork, today);
                //me fijo si actualiza usando la fecha que viene desde el calendario o si actualiza usando la fecha que se obtiene de la barra de busqueda
                //PROBAR CAMBIOOOOOO 28/3/2022
                const dailyWorkBeginDate = dailyWorkToUpdate.beginDate;
                const resultado = dateLocal === dailyWorkBeginDate ? await dao.updateDailyWork(dateLocal, dailyWorkToUpdate) : await dao.updateDailyWork(dailyWorkBeginDate, dailyWorkToUpdate);
                // if (resultado) {
                //     const updateResp = this.getDailyWorkRoutine(dayWork.routineScheduleId)
                //     return updateResp;
                // } else {
                //     return false;
                // }
                return resultado;
            }
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    updateDailyWorkByPlantShutdownWorkId = async (id, plantShutdownWorkId) => {
        try {
            const resultado = await dao.updateDailyWorkByPlantShutdownWorkId(id, plantShutdownWorkId);
            if (resultado)
                return true;
        } catch (err) {
            loggerError.error(err);
            return false
        } finally {
        }
    }


    // lo ejecuto como transaccion, hago todo el Dao de Mongo
    deleteDailyWork = async (dailyWork, socket) => {
        try {
            const resultado = await dao.deleteDailyWork(dailyWork);
            resultado && await apiRoutine.handleSocket({ socket, action: "get_qtyOverDueRoutines", io });
            return resultado;
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
            loggerInfo.info('deleteDailyWork');
        }
    }
}
