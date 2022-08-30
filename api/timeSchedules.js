import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiTimeSchedule {

    createTimeSchedule = async (timeSchedule) => {
        try {
            // const dropCollection = await dao.dropTimeScheduleCollection();
            const dropCollection = true
            if (dropCollection) {
                const timeScheduleResp = await dao.createTimeSchedule(timeSchedule);

                await ApiDailyWorksColumnTable.deleteColumns(await ApiDailyWorksColumnTable.getColumnsId())
                await ApiDailyWorksColumnTable.createColumns();

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

    static getTimeScheduleForSelectForm = async () => {
        try {
            const timeSchedule = await dao.getTimeSchedule();
            return timeSchedule;
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