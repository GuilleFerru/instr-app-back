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


const getQtyForManteinanceTypeChart = (dailyWorks, action) => {
    return Number(dailyWorks.filter(dailyWork => dailyWork.action === action).length);
}

const getQtyForSinglePlanChart = (dailyWorks, plant, manteinance) => {
    return Number(dailyWorks.filter(dailyWork => dailyWork.manteinance === manteinance && dailyWork.plant === plant).length);
}

const getQtyForMtdDntDensacChart = (dailyWorks, manteinance) => {
    return Number(dailyWorks.filter(dailyWork => dailyWork.manteinance === manteinance && (dailyWork.plant === 3 || dailyWork.plant === 4 || dailyWork.plant === 5)).length);
}

const getQtyForChlorineSodaChart = (dailyWorks, manteinance) => {
    return Number(dailyWorks.filter(dailyWork =>
        (dailyWork.manteinance === manteinance && (dailyWork.plant === 6 || dailyWork.plant === 7 || dailyWork.plant === 8 || dailyWork.plant === 9 || dailyWork.plant === 10))
    ).length);
}

const getQtyForTanksShipOffChart = (dailyWorks, manteinance) => {
    return Number(dailyWorks.filter(dailyWork =>
        (dailyWork.manteinance === manteinance && (dailyWork.plant === 13 || dailyWork.plant === 14 || dailyWork.plant === 15 || dailyWork.plant === 16))
    ).length);
}
const getQtyForLabPaladiumChart = (dailyWorks, manteinance) => {
    return Number(dailyWorks.filter(dailyWork =>
        (dailyWork.manteinance === manteinance && (dailyWork.plant === 17 || dailyWork.plant === 18))
    ).length);
}
const getQtyForOtrosChart = (dailyWorks, manteinance) => {
    return Number(dailyWorks.filter(dailyWork =>
    (dailyWork && dailyWork.manteinance === manteinance &&
        (dailyWork.plant === 19 || dailyWork.plant === 20 || dailyWork.plant === 21 || dailyWork.plant === 22 || dailyWork.plant === 23 || dailyWork.plant === 24 || dailyWork.plant === 0))
    ).length);
}


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
            loggerError.error(err);
        } finally {
        }
    }

    getChartsData = async (date) => {
        try {
            const dailyWorks = await apiDailyWork.getDailyWorksManteinanceActionsForChartDashboard(date);

            const dataManteinanceType = [
                {
                    name: 'Chequeo en campo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 1),
                    fill: '#8884d8'
                },
                {
                    name: 'Mantenimiento de rutina.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 2),
                    fill: '#83a6ed'
                },
                {
                    name: 'Cambio de equipo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 3),
                    fill: '#8dd1e1'
                },
                {
                    name: 'Desmontaje de equipo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 4) + getQtyForManteinanceTypeChart(dailyWorks, 5),
                    fill: '#84b596'
                },
                {
                    name: 'Montaje de equipo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 6),
                    fill: '#a4de6c'
                },
                {
                    name: 'Nuevo equipo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 7),
                    fill: '#b6ed57'
                },
                {
                    name: 'Previos.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 8) + getQtyForManteinanceTypeChart(dailyWorks, 9),
                    fill: '#ff7b07'
                },
                {
                    name: 'Calibración.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 10),
                    fill: '#ff9800'

                },
                {
                    name: 'Mantenimiento en campo.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 11),
                    fill: '#ffb107'

                },
                {
                    name: 'Mantenimiento en taller.',
                    value: getQtyForManteinanceTypeChart(dailyWorks, 12),
                    fill: '#ffc658'
                }
            ];

            const dataManteinance = [
                {
                    name: 'TDI',
                    Correctivos: getQtyForSinglePlanChart(dailyWorks, 1, 1),
                    Preventivos: getQtyForSinglePlanChart(dailyWorks, 1, 2),
                    Otros: getQtyForSinglePlanChart(dailyWorks, 1, 3) + getQtyForSinglePlanChart(dailyWorks, 1, 4) + getQtyForSinglePlanChart(dailyWorks, 1, 5)
                },
                {
                    name: 'GASES',
                    Correctivos: getQtyForSinglePlanChart(dailyWorks, 2, 1),
                    Preventivos: getQtyForSinglePlanChart(dailyWorks, 2, 2),
                    Otros: getQtyForSinglePlanChart(dailyWorks, 2, 3) + getQtyForSinglePlanChart(dailyWorks, 2, 4) + getQtyForSinglePlanChart(dailyWorks, 2, 5)
                },
                {
                    name: 'MTD DNT DENSAC',
                    Correctivos: getQtyForMtdDntDensacChart(dailyWorks, 1),
                    Preventivos: getQtyForMtdDntDensacChart(dailyWorks, 2),
                    Otros: getQtyForMtdDntDensacChart(dailyWorks, 3) + getQtyForMtdDntDensacChart(dailyWorks, 4) + getQtyForMtdDntDensacChart(dailyWorks, 5)
                },
                {
                    name: 'CLORO SODA',
                    Correctivos: getQtyForChlorineSodaChart(dailyWorks, 1),
                    Preventivos: getQtyForChlorineSodaChart(dailyWorks, 2),
                    Otros: getQtyForChlorineSodaChart(dailyWorks, 3) + getQtyForChlorineSodaChart(dailyWorks, 4) + getQtyForChlorineSodaChart(dailyWorks, 5)
                },
                {
                    name: 'PAC',
                    Correctivos: getQtyForSinglePlanChart(dailyWorks, 11, 1),
                    Preventivos: getQtyForSinglePlanChart(dailyWorks, 11, 2),
                    Otros: getQtyForSinglePlanChart(dailyWorks, 11, 3) + getQtyForSinglePlanChart(dailyWorks, 11, 4) + getQtyForSinglePlanChart(dailyWorks, 11, 5)
                },
                {
                    name: 'SERVICIOS',
                    Correctivos: getQtyForSinglePlanChart(dailyWorks, 12, 1),
                    Preventivos: getQtyForSinglePlanChart(dailyWorks, 12, 2),
                    Otros: getQtyForSinglePlanChart(dailyWorks, 12, 3) + getQtyForSinglePlanChart(dailyWorks, 12, 4) + getQtyForSinglePlanChart(dailyWorks, 12, 5)
                },
                {
                    name: 'EXPEDICION PLAYAS',
                    Correctivos: getQtyForTanksShipOffChart(dailyWorks, 1),
                    Preventivos: getQtyForTanksShipOffChart(dailyWorks, 2),
                    Otros: getQtyForTanksShipOffChart(dailyWorks, 3) + getQtyForTanksShipOffChart(dailyWorks, 4) + getQtyForTanksShipOffChart(dailyWorks, 5)
                },
                {
                    name: 'LABORATORIO PALADIO',
                    Correctivos: getQtyForLabPaladiumChart(dailyWorks, 1),
                    Preventivos: getQtyForLabPaladiumChart(dailyWorks, 2),
                    Otros: getQtyForLabPaladiumChart(dailyWorks, 3) + getQtyForLabPaladiumChart(dailyWorks, 4) + getQtyForLabPaladiumChart(dailyWorks, 5)
                },
                {
                    name: 'OTROS',
                    Correctivos: getQtyForOtrosChart(dailyWorks, 1),
                    Preventivos: getQtyForOtrosChart(dailyWorks, 2),
                    Otros: getQtyForOtrosChart(dailyWorks, 3) + getQtyForOtrosChart(dailyWorks, 4) + getQtyForOtrosChart(dailyWorks, 5)
                }
            ];
            const data = [dataManteinanceType, dataManteinance];
            return data;

        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }
}


