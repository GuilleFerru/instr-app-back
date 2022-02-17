import { dao } from '../server.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiAditional {

    createAditional = async (aditional) => {
        try {
            const aditionalResp = await dao.createAditional(aditional);
            return aditionalResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createTimeSchedule');
        }
    }

    getAditional = async () => {
        try {
            const aditional = await dao.getAditional();
            return aditional;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getAditional');
        }
    }
    
}