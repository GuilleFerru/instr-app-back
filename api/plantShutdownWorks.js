import { dao } from '../server.js';
import { PlantShutdownWorksColumnTable } from '../utils/plantShutdownWorksTable.js';
import { ApiDailyWork } from './dailyWorks.js';
import { loggerError, loggerInfo } from '../utils/logger.js';
import { ApiManteinanceAction } from './manteinanceActions.js';
import { ApiPlantShutdown } from './plantShutdowns.js';
//import { getDailyWorkTable } from './dailyWorks.js';
import { PlantShutdownDailyWorksColumnTable } from '../utils/plantShutdownDailyWorkTable.js';
import { changeIDForViewDTO as dailyWorkDTO } from '../model/DTOs/dailyWork.js'
import {
    changeIDForViewDTO,
    normalizeIDViewDTO,
    savePlantShutdownWorkDTO,
    plantShutdownWorksRespDTO,
    saveDailyWorkFromShutdownWorkDTO,
} from '../model/DTOs/plantShutdownWork.js';




export class ApiPlantShutdownWork {

    handleSocket = async (...data) => {
        const apiDailyWork = new ApiDailyWork();
        try {
            const { date, socket, action, plantShutdownWorkData, roomId, io } = data[0];

            if (action === 'get_plant_shutdown_works') {
                const data = await this.getPlantShutdownWorksByPlantShutdownId(plantShutdownWorkData);
                data && socket.emit('get_plant_shutdown_works', data);

            } else if (action === 'create_plant_shutdown_work') {
                const data = await this.createPlantShutdownWork(plantShutdownWorkData, apiDailyWork);
                data && socket.emit('get_plant_shutdown_works', await this.getPlantShutdownWorksByPlantShutdownId(plantShutdownWorkData.plantShutdownId));

            } else if (action === 'create_plant_shutdown_work_from_work_to_do') {
                const data = await this.createPlantShutdownWorkFromWorkToDo(plantShutdownWorkData, apiDailyWork);
                data && socket.emit('get_daily_works_for_plant_shutdown', await apiDailyWork.getDailyWorkForPlantShutdown());

            } else if (action === 'bulk_create_plant_shutdown_work_from_work_to_do') {
                // NO FUNCIONA.. POR AHORA LO DEJO ASI
                plantShutdownWorkData.forEach(async (data) => await this.createPlantShutdownWorkFromWorkToDo(data, apiDailyWork));
                io.emit('get_daily_works_for_plant_shutdown', await apiDailyWork.getDailyWorkForPlantShutdown());

            } else if (action === 'update_plant_shutdown_work') {
                const data = await this.updatePlantShutdownWork(plantShutdownWorkData, apiDailyWork);
                data && socket.emit('get_plant_shutdown_works', await this.getPlantShutdownWorksByPlantShutdownId(plantShutdownWorkData.newData.plantShutdownId));

            } else if (action === 'delete_plant_shutdown_work') {
                const data = await this.deletePlantShutdownWork(plantShutdownWorkData, apiDailyWork);
                data && socket.emit('get_plant_shutdown_works', await this.getPlantShutdownWorksByPlantShutdownId(plantShutdownWorkData.plantShutdownId));
            }
        } catch (error) {
            console.log(error);
            loggerError.error(error);
        }
    }

    createPlantShutdownWork = async (plantShutdownWorkData, apiDailyWork = null) => {
        try {
            const plantShutdown = await dao.getPlantShutdownById(plantShutdownWorkData.plantShutdownId);
            if (plantShutdown) {
                const beginDate = plantShutdown[0].beginDate;
                const endDate = plantShutdown[0].endDate;
                const plantShutdownWorkToSave = savePlantShutdownWorkDTO(plantShutdownWorkData, beginDate, endDate, null);
                const plantShutdownWork = await dao.createPlantShutdownWork(plantShutdownWorkToSave);

                if (plantShutdownWork.length > 0) {
                    // si la descripcion es distinta de null es porque ya se empezo con el trabajo, se debe crear un dayliWork con la fecha actual
                    const createDailyWork = plantShutdownWorkToSave.description !== '';
                    if (createDailyWork) {
                        const dailyWorkToSave = plantShutdownWorkToSave;
                        dailyWorkToSave.plantShutdownWorkId = plantShutdownWork[0]._id;
                        const dailyWork = saveDailyWorkFromShutdownWorkDTO(dailyWorkToSave);
                        await apiDailyWork.createDailyWork(dailyWork, 'fromPlantShutdownWork');
                    }
                    return true;
                }
                return false;
            } else {
                return false;
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    // me crea un tarea para paro de pta desde tareas no asignadas a un paro y me actualiza el plantShutdownId en la tabla dailyWork
    createPlantShutdownWorkFromWorkToDo = async (plantShutdownWorkData, apiDailyWork = null) => {
        try {
            const plantShutdownId = plantShutdownWorkData.plantShutdownId;
            if (plantShutdownId) {
                const plantShutdown = await dao.getPlantShutdownById(plantShutdownId);
                //creo un trabjo de paro de pta con fecha de inicio y fin iguales al paro de pta al que se asigno
                const plantShutdownWorkToSave = savePlantShutdownWorkDTO(plantShutdownWorkData, plantShutdown[0].beginDate, plantShutdown[0].endDate, plantShutdown[0].timeSchedule);
                const plantShutdownWork = await dao.createPlantShutdownWork(plantShutdownWorkToSave);
                //actualizo el plantShutdownId en la tabla dailyWork
                if (plantShutdownWork.length > 0) {
                    const dailyWorkUpdatePlantShutdownId = await apiDailyWork.updateDailyWorkByPlantShutdownWorkId(plantShutdownWorkData.id, plantShutdownWork[0]._id);
                    if (dailyWorkUpdatePlantShutdownId) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
            loggerInfo.info('createdPlantShutdownWork');
        }
    }

    getPlantShutdownWorksByPlantShutdownId = async (plantShutdownId) => {
        try {
            const columns = [];
            const plantShutdownWorks = [];
            const rawPlantShutdownWorks = await dao.getPlantShutdownWorksByPlantShutdownId(plantShutdownId);
            rawPlantShutdownWorks.map((plantShutdownWork) => { plantShutdownWorks.push(changeIDForViewDTO(plantShutdownWork)) });
            const savedColumns = await PlantShutdownWorksColumnTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await PlantShutdownWorksColumnTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }


            const plantShutdownWorksComplete = await Promise.all(
                plantShutdownWorks.map(async (plantShutdownWork) => {
                    const dailyWorks = await dao.getDailyWorkByPlantShutdownWorkId(plantShutdownWork.id);
                    const dailyWorksForView = dailyWorks.map((dailyWork) => { return dailyWorkDTO(dailyWork) });
                    plantShutdownWork.dailyWorks = dailyWorksForView;
                    return plantShutdownWork;
                })
            )

            //si el paro no empezo no dejo agregar descripcion para q no me cree un dailyWork
            const apiPlantShutdown = new ApiPlantShutdown();
            const plantShutdown = await apiPlantShutdown.getPlantShutdownById(plantShutdownId);
            const plantShutdownBeginDate = plantShutdown[0].beginDate;
            if (new Date() <= plantShutdownBeginDate) {
                columns[0][8].editable = "never";
            }
            const action = await ApiManteinanceAction.getManteinanceActionsForSelectForm();
            let dayWorksColumns = []
            dayWorksColumns = await PlantShutdownDailyWorksColumnTable.getColumns();
            if (dayWorksColumns.length === 0) {
                dayWorksColumns = await PlantShutdownDailyWorksColumnTable.createColumns();
            }

            if (plantShutdownWorksComplete.length > 0) {
                return plantShutdownWorksRespDTO(plantShutdownWorksComplete, ...columns, action, dayWorksColumns[0].columns);
            } else {
                return plantShutdownWorksRespDTO([], ...columns, action);
            }
        } catch (err) {

            loggerError.error(err);
        } finally {
        }
    }

    updatePlantShutdownWork = async (plantShutdownWorkData, apiDailyWork = null) => {
        try {
            const newPlantShutdownWork = plantShutdownWorkData.newData;
            const oldPlantShutdownWork = plantShutdownWorkData.oldData;
            const oldDescription = oldPlantShutdownWork.description;
            const newDescription = newPlantShutdownWork.description;
            const oldBeginDate = oldPlantShutdownWork.beginDate;
            const newBeginDate = newPlantShutdownWork.beginDate;
            const complete = newPlantShutdownWork.complete;

            // si la tarea no se va a hacer por algún motivo me actualiza los dailyWorks creados para que me vuelva a aparecer el original en la tabla worktodo
            if (complete === 'RE') {
                const dailyWorks = newPlantShutdownWork.dailyWorks;
                for (const dailyWork of dailyWorks) {
                    dailyWork.plantShutdownWorkId = '1';
                    await apiDailyWork.updateDailyWork(dailyWork.beginDate, dailyWork, 'fromPlantShutdownWorks');
                }
                // me actualiza plantShutdownWork para que se sepa porque no se hizo el trabajo.
                await dao.updatePlantShutdownWork(normalizeIDViewDTO(newPlantShutdownWork));

                // me crea un dailyWork de porque no se hizo el trabajo.
                const plantShutdownWork = saveDailyWorkFromShutdownWorkDTO(newPlantShutdownWork);
                plantShutdownWork.plantShutdownWorkId = '1';
                plantShutdownWork.complete = 'P';
                await apiDailyWork.createDailyWork(plantShutdownWork, 'fromPlantShutdownWork');
                return true;
            } else {
                // si actualiza el trabajo realizado, creo un nuevo dailyWork con la fecha actual de la modificacion
                if (oldDescription !== newDescription || oldBeginDate !== newBeginDate) {
                    const plantShutdownWork = saveDailyWorkFromShutdownWorkDTO(newPlantShutdownWork);
                    await apiDailyWork.createDailyWork(plantShutdownWork, 'fromPlantShutdownWork');
                }
                const oldTag = oldPlantShutdownWork.tag;
                const newTag = newPlantShutdownWork.tag;
                const oldOt = oldPlantShutdownWork.ot;
                const newOt = newPlantShutdownWork.ot;
                if (oldTag !== newTag || oldOt !== newOt) {
                    const dailyWorks = newPlantShutdownWork.dailyWorks;
                    for (const dailyWork of dailyWorks) {
                        dailyWork.tag = newTag;
                        dailyWork.ot = newOt;
                        await apiDailyWork.updateDailyWork(dailyWork.beginDate, dailyWork, 'fromPlantShutdownWorks');
                    }
                }
                const plantShutdownWork = await dao.updatePlantShutdownWork(normalizeIDViewDTO(newPlantShutdownWork));
                if (plantShutdownWork) {
                    return true;
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

    deletePlantShutdownWork = async (plantShutdownWorkData, apiDailyWork = null) => {
        try {
            const normalizePlantShutdownWork = normalizeIDViewDTO(plantShutdownWorkData);
            const dailyWorks = await apiDailyWork.getDailyWorkByPlantShutdownWorkId(normalizePlantShutdownWork._id);
            dailyWorks.forEach(async (dailyWork) => {
                const dailyWorkToDelete = {
                    id: dailyWork._id,
                    routineScheduleId: dailyWork.routineScheduleId,
                    action: dailyWork.action
                }
                await apiDailyWork.deleteDailyWork(dailyWorkToDelete);
            });
            const plantShutdownWork = await dao.deletePlantShutdownWork(normalizePlantShutdownWork);
            if (plantShutdownWork) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }


}