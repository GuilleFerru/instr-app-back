import { dao } from '../server.js';
import { PlantShutdownTable } from '../utils/plantShutdownsColumnTable.js';
import { loggerError, loggerInfo } from '../utils/logger.js';


const plantShutdownResp = (plantShutdowns, columns) => {
    const plantShutdownResp = { plantShutdowns, columns, date };
    return plantShutdownResp;
}

export class ApiPlantShutdown {


    handleSocket = async (...data) => {
        try {
            const { date, socket, action, plantShutdownData, roomId, io } = data[0];

            if (action === 'get_plant_shutdowns') {

                const data = await this.getPlantShutdowns(date);
                data && socket.emit('get_plant_shutdowns', data);

            } else if (action === 'create_plant_shutdown') {

                const data = await this.createPlantShutdown(plantShutdownData, '');
                data && io.to(roomId).emit('get_plant_shutdowns', await this.getPlantShutdowns());

            }
        } catch (error) {
            console.log(error);
            loggerError.error(error);
        }
    }

    createPlantShutdown = async () => {
        try {

        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createdPlantShutdown');
        }
    }

    getPlantShutdowns = async () => {
        try {
            const plantShutdowns = await dao.getPlantShutdowns();
            const columns = [];
            const savedColumns = await PlantShutdownTable.getColumns();
            if (savedColumns.length === 0) {
                const savedColumns = await PlantShutdownTable.createColumns();
                columns.push(savedColumns[0].columns);
            } else {
                columns.push(savedColumns[0].columns);
            }

            return plantShutdownResp(plantShutdowns, ...columns);


        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}