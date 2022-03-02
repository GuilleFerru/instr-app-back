import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiTimeSchedule {

    createTimeSchedule = async (timeSchedule) => {
        try {
            // const dropCollection = await dao.dropTimeScheduleCollection();
            const dropCollection = true
            if (dropCollection) {
                const timeScheduleResp = await dao.createTimeSchedule(timeSchedule);
                return timeScheduleResp;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createTimeSchedule');
        }
    }

    getTimeSchedule = async () => {
        try {
            const timeSchedule = await dao.getTimeSchedule();
            return timeSchedule;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getTimeScheduleForColumnTable = async () => {
        try {
            const timeSchedule = await dao.getTimeSchedule();
            return reduceForLookUp(timeSchedule);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    dropTimeSchedule = async () => {
        try {
            const timeScheduleResp = await dao.dropTimeScheduleCollection();
            return timeScheduleResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('dropTimeSchedule');
        }
    }


}