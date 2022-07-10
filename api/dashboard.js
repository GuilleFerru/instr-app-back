import { ApiRoutine } from './routines.js';
import { ApiDailyWork } from './dailyWorks.js';
import { ApiPlantShutdown } from './plantShutdowns.js';
import { ApiSchedule } from './schedules.js';
import { ApiManteinanceAction } from './manteinanceActions.js';
import { startAndEndOfWeek } from '../utils/formatDate.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

const apiRoutine = new ApiRoutine();
const apiDailyWork = new ApiDailyWork();
const apiPlantShutdown = new ApiPlantShutdown();
const apiSchedule = new ApiSchedule();
//const apiManteinanceAction = new ApiManteinanceAction();


export class ApiDashboard {

    getWidgetData = async (date) => {
        try {
            const widgetData = [];
            const routines = await apiRoutine.getRoutinesForWidgetDashboard(date)
            const dailyWorks = await apiDailyWork.getDailyWorksForWidgetDashboard(startAndEndOfWeek(date));
            const plantShutdown = await apiPlantShutdown.getPlantShutdownForWidgetDashboard(date);
            const schedule = await apiSchedule.getScheduleForWidgetDashboard(date);
            widgetData.push(routines, dailyWorks, plantShutdown, schedule);
            return widgetData;
        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    getChartsData = async (date) => {
        try {

            const dailyWorks = await apiDailyWork.getDailyWorksManteinanceActionsForChartDashboard(date);
            
            const qtyFieldCheck = dailyWorks.filter(dailyWork => dailyWork.action === 1).length;
            const qtyRoutineMaint = dailyWorks.filter(dailyWork => dailyWork.action === 2).length;
            const qtyChangeEq = dailyWorks.filter(dailyWork => dailyWork.action === 3).length;
            const qtyUnmountEq = dailyWorks.filter(dailyWork => dailyWork.action === 4 || dailyWorks.action === 5).length;
            const qtyMountEq = dailyWorks.filter(dailyWork => dailyWork.action === 6).length;
            const qtyNewEq = dailyWorks.filter(dailyWork => dailyWork.action === 7).length;
            const qtyprevenientJobs = dailyWorks.filter(dailyWork => dailyWork.action === 8 || dailyWork.action === 9).length;
            const qtyCalibJobs = dailyWorks.filter(dailyWork => dailyWork.action === 10).length;
            const qtyFieldMaint = dailyWorks.filter(dailyWork => dailyWork.action === 11).length;
            const qtyWorkshopMain = dailyWorks.filter(dailyWork => dailyWork.action === 12).length;

            const data = [
                {
                    name: 'Chequeo en campo.',
                    value: Number(qtyFieldCheck),
                    fill: '#8884d8'
                },
                {
                    name: 'Mantenimiento de rutina.',
                    value: Number(qtyRoutineMaint),
                    fill: '#83a6ed'
                },
                {
                    name: 'Cambio de equipo.',
                    value: Number(qtyChangeEq),
                    fill: '#8dd1e1'
                },
                {
                    name: 'Desmontaje de equipo.',
                    value: Number(qtyUnmountEq),
                    fill: '#82ca9d'
                },
                {
                    name: 'Montaje de equipo.',
                    value: Number(qtyMountEq),
                    fill: '#a4de6c'
                },
                {
                    name: 'Nuevo equipo.',
                    value: Number(qtyNewEq),
                    fill: '#d0ed57'
                },
                {
                    name: 'Previos.',
                    value: Number(qtyprevenientJobs),
                    fill: '#ffc658'
                },
                {
                    name: 'Calibración.',
                    value: Number(qtyCalibJobs),
                    fill: '#ffb107'
                },
                {
                    name: 'Mantenimiento en campo.',
                    value: Number(qtyFieldMaint),
                    fill: '#ff9800'
                },
                {
                    name: 'Mantenimiento en taller.',
                    value: Number(qtyWorkshopMain),
                    fill: '#ff7b07'
                }
            ];

            return data;

        } catch (err) {

            loggerError.error(err);
        } finally {
        }
    }
}


