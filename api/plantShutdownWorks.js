import { dao } from '../server.js';
import { PlantShutdownWorksColumnTable } from '../utils/plantShutdownWorksTable.js';
import { savePlantShutdownWorkDTO, plantShutdownWorksRespDTO, removePlantShutdownWorkIdDTO } from '../model/DTOs/plantShutdownWork.js';
//import { ApiPlantShutdown } from './plantShutdowns.js';
import { ApiDailyWork } from './dailyWorks.js';
import { loggerError, loggerInfo } from '../utils/logger.js';

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
                const timeSchedule = plantShutdown[0].timeSchedule;
                const plantShutdownWorkToSave = savePlantShutdownWorkDTO(plantShutdownWorkData, beginDate, endDate, timeSchedule);

                // si la descripcion es distinta de null es porque ya se empezo con el trabajo, se debe crear un dayliWork con la fecha actual
                const createDailyWork = plantShutdownWorkToSave.description !== '';
                if (createDailyWork) {
                    const dailyWorkToSave = plantShutdownWorkToSave;
                    const dailyWork = await apiDailyWork.createDailyWork(dailyWorkToSave, 'fromPlantShutdownWork');
                    const dailyWorkId = dailyWork[0]._id;
                    plantShutdownWorkToSave.dailyWorkId = dailyWorkId;
                    //le fuerzo la fecha de inicio igual al paro de pta.
                    plantShutdownWorkToSave.beginDate = beginDate;
                }

                await dao.createPlantShutdownWork(plantShutdownWorkToSave);
                return true;
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
                    const dailyWorkUpdatePlantShutdownId = await apiDailyWork.updateDailyWorkByShutdownId(plantShutdownWork[0].dailyWorkId, plantShutdownId);
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
            const plantShutdownWorks = await dao.getPlantShutdownWorksByPlantShutdownId(plantShutdownId);
            const savedColumns = await PlantShutdownWorksColumnTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await PlantShutdownWorksColumnTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }
            if (plantShutdownWorks.length > 0) {
                return plantShutdownWorksRespDTO(plantShutdownWorks, ...columns);
            } else {
                return plantShutdownWorksRespDTO([], ...columns);
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
            // si actualiza el trabajo realizado, creo un nuevo dailyWork con la fecha actual de la modificacion
            if (oldDescription !== newDescription) {
                // le saco el id del dailyWork para que no lo guarde como rutina
                const plantShutdownWorkRest = removePlantShutdownWorkIdDTO(newPlantShutdownWork);
                const dailyWork = await apiDailyWork.createDailyWork(plantShutdownWorkRest, 'fromPlantShutdownWork');
                newPlantShutdownWork.dailyWorkId.push(dailyWork[0]._id);
            }
            const plantShutdownWork = await dao.updatePlantShutdownWork(newPlantShutdownWork);
            if (plantShutdownWork) {
                return true;
            } else {
                return false;
            }

        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    deletePlantShutdownWork = async (plantShutdownWorkData, apiDailyWork = null) => {
        try {
            plantShutdownWorkData.dailyWorkId.forEach(async (dailyWorkId) => {
                const dailyWork = {
                    id: dailyWorkId,
                    routineScheduleId: plantShutdownWorkData.routineScheduleId,
                    action: plantShutdownWorkData.action
                }
                await apiDailyWork.deleteDailyWork(dailyWork);
            });
            const plantShutdownWork = await dao.deletePlantShutdownWork(plantShutdownWorkData);
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