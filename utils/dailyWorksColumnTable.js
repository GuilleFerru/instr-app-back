import { dao } from '../server.js';
import { plantData, attelierData, timeScheduleData, manteinanceData, manteinanceActionData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

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
            defaultGroupOrder:0,
            defaultGroupSort:'desc'
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
            initialEditValue: 1
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

export class ApiDailyWorksColumnTable {

    static createColumns = async () => {
        try {
            const columns = createDailyWorkColumns(await plantData(),await attelierData(),await timeScheduleData(),await manteinanceData(),await manteinanceActionData());
            const saveColumns = { columns: columns };
            const resp = await dao.createDailyWorksColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getDailyWorksColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getColumnsId = async () => {
        try {
            const resp = await dao.getIdDailyWorkColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static deleteColumns = async (id) => {
        try {
            const resp = await dao.deleteDailyWorksColumns(id);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}