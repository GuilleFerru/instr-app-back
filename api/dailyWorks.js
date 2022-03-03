import { dao } from '../server.js';
import { formatDate, todayInLocalDate, dateInLocalDate } from '../utils/formatDate.js';
import { ApiRoutine } from './routines.js';
import { ApiPlant } from './plants.js';
import { ApiAttelier } from './attelieres.js';
import { ApiTimeSchedule } from './timeSchedules.js';
import { ApiManteinance } from './manteinances.js';
import { ApiManteinanceAction } from './manteinanceActions.js';
import { saveDailyWorkDTO, updateDayWorkDTO } from '../model/DTOs/dailyWork.js';
import { loggerError, loggerInfo } from '../utils/logger.js';


const apiRoutine = new ApiRoutine();



const createDailyWorkColumns = (plantsForColumnTable, atteliersForColumnTable, timeScheduleForColumnTable, manteinancesForColumnTable, manteinanceActionsForColumnTable) => {
    const columns = [
        {
            field: '_id',
            title: 'Numero',
            hidden: true,

        },
        {
            field: 'plant',
            title: 'Planta',
            lookup: plantsForColumnTable,
        },
        {
            field: 'attelier',
            title: 'Attelier',
            lookup: atteliersForColumnTable,
        },
        {
            field: 'tag',
            title: 'TAG',
            type: 'string',
        },
        {
            field: 'timeSchedule',
            title: 'Horario',
            lookup: timeScheduleForColumnTable,
            initialEditValue: '5',
        },
        {
            field: 'manteinance',
            title: 'Tipo de mto',
            lookup: manteinancesForColumnTable,
            initialEditValue: '1',
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            align: 'left',
        },
        {
            field: 'action',
            title: 'Acción',
            lookup: manteinanceActionsForColumnTable,
        },
        {
            field: 'description',
            title: 'Descripción',
            multiline: true,
            width: '40%'

        },
        {
            field: 'complete',
            title: 'Estado',
            lookup: {
                'P': 'Pendiente',
                'C': 'Completado',
                'R': 'Demorado',
            },
            initialEditValue: 'C',

        }

    ];
    return columns;
}

const worksResp = (dayWorks, columns) => {
    const worksResp = { dayWorks, columns };
    return worksResp;
}


export class ApiDailyWork {

    createDailyWork = async (data) => {
        try {
            const dayWorks = saveDailyWorkDTO(data);
            await dao.createDailyWork(dayWorks);
            return dayWorks;
        } catch (err) {
            console.log(err);
            loggerError.error(err);
        } finally {
            loggerInfo.info('createDailyWork');
        }
    }

    getDailyWork = async (date) => {
        try {
            //para crear las columnas de la tabla
            const plantsForColumnTable = await ApiPlant.getPlantsForColumnTable();
            const atteliersForColumnTable = await ApiAttelier.getAttelieresForColumnTable();
            const timeScheduleForColumnTable = await ApiTimeSchedule.getTimeScheduleForColumnTable();
            const manteinancesForColumnTable = await ApiManteinance.getManteinancesForColumnTable();
            const manteinanceActionsForColumnTable = await ApiManteinanceAction.getManteinanceActionsForColumnTable();
            const columns = createDailyWorkColumns(plantsForColumnTable, atteliersForColumnTable, timeScheduleForColumnTable, manteinancesForColumnTable, manteinanceActionsForColumnTable);
            //

            const dateLocalString = formatDate(date);
            const dayWorks = await dao.getDailyWork(dateLocalString);

            if (dayWorks.length === 0) {
                const routines = await apiRoutine.getRoutine(date);
                const dayWorks = [];
                routines.map(routine => {
                    dayWorks.push(saveDailyWorkDTO(routine, dateLocalString))
                });
                const currentMonth = todayInLocalDate().getMonth() + 1;
                const dateMonth = dateInLocalDate(date).getMonth() + 1;
                currentMonth === dateMonth && await dao.createDailyWork(dayWorks);
                return worksResp(dayWorks, columns);
            } else {
                return worksResp(dayWorks, columns);
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }


    updateDailyWork = async (date, dayWork) => {
        try {
            const dateLocal = formatDate(date);
            if (dateLocal && dayWork) {
                const dailyWork = updateDayWorkDTO(dayWork);
                const routineOT = dailyWork.action === 2 && dailyWork.ot != '' ? dailyWork.ot : false;

                if (routineOT) {
                    const routineScheduleId = dayWork.routineScheduleId;
                    await dao.updateRoutineScheduleOT(routineScheduleId, routineOT);
                }

                const resultado = await dao.updateDailyWork(dateLocal, dailyWork);
                if (resultado) {
                    return resultado;
                } else {
                    return false;
                }
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    deleteDailyWork = async (id) => {
        try {
            await dao.deleteDailyWork(id);
            return dayWorks;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('deleteDailyWork');
        }
    }
}
