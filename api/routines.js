import { dao } from '../server.js'
import { loggerError, loggerInfo, loggerWarn } from '../utils/logger.js';

export class ApiRoutine {

    createDayRoutine = async (date) => {
        try {
            
            
            const routine = await dao.createRoutine(date);
            return routine;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createRoutine');
        }
    }


}
