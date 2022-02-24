import { dao } from '../server.js';
import { ApiRoutine } from './routines.js';
import { loggerError, loggerInfo } from '../utils/logger.js';


const createDayRoutine = async (dayOfWeek) => {
    const apiRoutine = new ApiRoutine();
    const dailyRoutine = await apiRoutine.createDayRoutine(dayOfWeek);
    return dailyRoutine
}


export class ApiDailyWork {



    createDailyWork = async (date) => {
        try {
            const dayOfWeek = new Date(date).getDay();
            console.log(dayOfWeek, '.........................DAY OF WEEK....................')
            console.log(createDayRoutine(dayOfWeek))
            return true;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createDailyWork');
        }
    }

    getDailyWork = async (date) => {
        try {
            console.log(date)
            const dailyWork = await dao.getDailyWork(date);
            return dailyWork;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getDailyWork');
        }
    }



}
