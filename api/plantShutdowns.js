import { dao } from '../server.js';
import { ApiPlantShutdownWork } from './plantShutdownWorks.js';
import { ApiDailyWork } from './dailyWorks.js';
import { PlantShutdownTable } from '../utils/plantShutdownsColumnTable.js';
import { createPlantShutdownDTO, plantShutdownRespDTO, plantShutdownReduceForLookUpDTO } from '../model/DTOs/plantShutdown.js';
import { PlantShutdownWorksToDoColumnTable } from '../utils/plantShutdownWorksToDoTable.js';
import { dateInLocalDate } from '../utils/formatDate.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { loggerError, loggerInfo } from '../utils/logger.js';

const apiPlantShutdownWork = new ApiPlantShutdownWork();



export class ApiPlantShutdown {


    handleSocket = async (...data) => {
        try {
            const { date, socket, action, plantShutdownData, roomId, io } = data[0];

            if (action === 'get_plant_shutdowns') {
                const data = await this.getPlantShutdowns(date);
                data && socket.emit('get_plant_shutdowns', data);
            } else if (action === 'create_plant_shutdown') {
                await this.createPlantShutdown(plantShutdownData);
                socket.emit('get_plant_shutdowns', await this.getPlantShutdowns());
            } else if (action === 'update_plant_shutdown') {
                await this.updatePlantShutdown(plantShutdownData);
                socket.emit('get_plant_shutdowns', await this.getPlantShutdowns(date));
            } else if (action === 'delete_plant_shutdown') {
                await this.deletePlantShutdown(plantShutdownData);
                socket.emit('get_plant_shutdowns', await this.getPlantShutdowns());
            }
        } catch (error) {
            console.log(error);
            loggerError.error(error);
        }
    }

    createPlantShutdown = async (plantShutdownData) => {
        try {
            const plantShutdownToSave = createPlantShutdownDTO(plantShutdownData);
            const plantShutdown = await dao.createPlantShutdown(plantShutdownToSave);
            if (plantShutdown) {
                PlantShutdownWorksToDoColumnTable.deleteColumns()
                return plantShutdown
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createdPlantShutdown');
        }
    }

    getPlantShutdowns = async (date = new Date()) => {
        try {
            const year = dateInLocalDate(date).getFullYear();
            const plantShutdowns = await dao.getPlantShutdowns(year);
            const columns = [];
            const savedColumns = await PlantShutdownTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await PlantShutdownTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }
            return plantShutdownRespDTO(plantShutdowns, ...columns);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getPlantShutdownById = async (id) => {
        try {
            const plantShutdown = await dao.getPlantShutdownById(id);
            return plantShutdown;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getPlantShutdownsForColumnTable = async () => {
        try {
            const getPlantShutdownsUnfinished = await dao.getPlantShutdownsUnfinished();
            const reducedForLookUp = plantShutdownReduceForLookUpDTO(getPlantShutdownsUnfinished);
            reducedForLookUp.push({
                id: '1',
                name: 'Sin paro de planta asignado',
            })
            return reduceForLookUp(reducedForLookUp);
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
        }
    }

    updatePlantShutdown = async (plantShutdownData) => {
        try {
            const plantShutdown = await dao.updatePlantShutdown(plantShutdownData);
            if (plantShutdown) {
                PlantShutdownWorksToDoColumnTable.deleteColumns()
                return plantShutdown;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('updatedPlantShutdown');
        }
    }

    deletePlantShutdown = async (plantShutdownData) => {
        try {
            const apiDailyWork = new ApiDailyWork();
            const plantShutdownWorks = await dao.getPlantShutdownWorksByPlantShutdownId(plantShutdownData._id);

            if (plantShutdownWorks.length > 0) {
                plantShutdownWorks.forEach(async (plantShutdownWork) => {
                    await apiPlantShutdownWork.deletePlantShutdownWork(plantShutdownWork, apiDailyWork);
                });
            }
            const plantShutdown = await dao.deletePlantShutdown(plantShutdownData);
            if (plantShutdown) {
                PlantShutdownWorksToDoColumnTable.deleteColumns()
                return plantShutdown;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('deletedPlantShutdown');
        }
    }

}