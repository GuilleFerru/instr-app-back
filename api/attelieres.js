import { dao } from '../server.js';
import {reduceForLookUp} from '../utils/reduceForLookup.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiAttelier {

    createAttelier = async (attelier) => {
        try {
            const attelierResp = await dao.createAttelier(attelier);
            return attelierResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createAttelier');
        }
    }

    getAttelieres = async () => {
        try {
            const attelieres = await dao.getAttelieres();
            return attelieres;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getAttelieresForColumnTable = async () => {
        try {
            const attelieres = await dao.getAttelieres();
            return reduceForLookUp(attelieres);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    
    getAtteliresByPlant = async (plantName) => {
        try {
            const attelieres = await dao.getAtteliersByPlant(plantName);
            console.log('attelieres');
            return attelieres;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }
    
}