import { ApiRoutine } from './routines.js';
import { ApiDailyWork } from './dailyWorks.js';
import { ApiPlantShutdown } from './plantShutdowns.js';
import { ApiSchedule } from './schedules.js';
import { startAndEndOfWeek } from '../utils/formatDate.js';
import { loggerError } from '../utils/logger.js'

const apiRoutine = new ApiRoutine();
const apiDailyWork = new ApiDailyWork();
const apiPlantShutdown = new ApiPlantShutdown();
const apiSchedule = new ApiSchedule();


export class ApiDashboard {

    getDashboardData = async (date) => {
        try {
            const widgetData = [];
            const routines = await apiRoutine.getRoutinesForDashboard(date)
            const dailyWorks = await apiDailyWork.getDailyWorksForDashboard(startAndEndOfWeek(date));
            const plantShutdown = await apiPlantShutdown.getPlantShutdownForDashboard(date);
            const schedule = await apiSchedule.getScheduleForDashboard(date);
            widgetData.push(routines, dailyWorks, plantShutdown, schedule);
            return widgetData;
        } catch (err) {

            loggerError.error(err);
        } finally {
        }
    }
}


