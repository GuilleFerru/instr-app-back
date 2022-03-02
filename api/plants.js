import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { loggerError, loggerInfo } from '../utils/logger.js'


export class ApiPlant {

    createPlant = async (id, plant) => {
        try {
            const newPlant = {
                id: id,
                name: plant
            }
            const plantResp = await dao.createPlant(newPlant);
            return plantResp;
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
            
        }
    }

    getPlants = async () => {
        try {
            const plants = await dao.getPlants();
            return plants;
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
            
        }
    }

    static getPlantsForColumnTable = async () => {
        try {
            const plants = await dao.getPlants();
            return reduceForLookUp(plants);
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
            
        }
    }
}
