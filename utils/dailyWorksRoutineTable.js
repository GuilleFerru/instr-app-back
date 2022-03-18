import { dao } from '../server.js';
import { plantData, attelierData, timeScheduleData, manteinanceData, manteinanceActionData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createDailyRoutineColumns = (plantsForColumnTable, atteliersForColumnTable, timeScheduleForColumnTable, manteinancesForColumnTable, manteinanceActionsForColumnTable) => {
    const columns = [
        {
            field: '_id',
            title: 'Numero',
            hidden: true,
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
            field: 'beginDate',
            title: 'Fecha inicio',
            type: 'string',
        },
        {
            field: 'endDate',
            title: 'Fecha de chequeo',
            type: 'string',
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            align: 'left',
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
                'E': 'En ejecución',
                'P': 'Pendiente',
                'C': 'Completado',
                'R': 'Demorado',
            },
            initialEditValue: 'C',
        }
    ];
    return columns;
}

export class DailyWorksRoutineTable {

    static createColumns = async () => {
        try {
            const columns = createDailyRoutineColumns(await plantData(),await attelierData(),await timeScheduleData(),await manteinanceData(),await manteinanceActionData());
            const saveColumns = { columns: columns };
            const resp = await dao.createDailyWorksRoutineColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getDailyWorksRoutineColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getColumnsId = async () => {
        try {
            const resp = await dao.getIdDailyWorkRoutineColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static deleteColumns = async (id) => {
        try {
            const resp = await dao.deleteDailyWorksRoutineColumns(id);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}