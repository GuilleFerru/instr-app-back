import { dao } from '../server.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiScheduleUpdate {

    createScheduleUpdate = async (scheduleUpdate) => {
        try {
            const scheduleUpdateResp = await dao.createScheduleUpdate(scheduleUpdate);
            return scheduleUpdateResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createScheduleUpdate');
        }
    }

}