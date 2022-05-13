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
            field: 'beginDate',
            title: 'Fecha de inicio',
            hidden: true,
            type: 'string',
        },
        {
            field: 'plant',
            title: 'Planta',
            lookup: plantsForColumnTable,
            "initialEditValue" : "0",
            width : "10%"
        },
        {
            field: 'attelier',
            title: 'Attelier',
            lookup: atteliersForColumnTable,
            "initialEditValue" : "0",
            width : "5%"
        },
        {
            field: 'tag',
            title: 'TAG',
            type: 'string',
            width : "10%"
        },
        {
            field: 'timeSchedule',
            title: 'Horario',
            lookup: timeScheduleForColumnTable,
            initialEditValue: '5',
            width : "5%"
            // defaultGroupOrder: 0,
            // defaultGroupOrder: 1,
        },
        {
            field: 'manteinance',
            title: 'Tipo de mto',
            lookup: manteinancesForColumnTable,
            initialEditValue: '1',
            width : "10%"
            // defaultGroupSort: 'desc'
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            align: 'left',
            width : "5%"
        },
        {
            field: 'action',
            title: 'Acción',
            lookup: manteinanceActionsForColumnTable,
            initialEditValue: "1",
            width : "15%"
        },
        {
            field: 'description',
            title: 'Descripción',
            multiline: true,
            width: '30%'
        },
        {
            field: 'complete',
            title: 'Estado',
            lookup: {
                'E': 'En ejecución',
                'P': 'Pendiente',
                'C': 'Completado',
                'R': 'Demorado',
                'PP': 'Paro de planta',
            },
            initialEditValue: 'C',
            align: 'left',
            width : "10%"
        }
    ];
    return columns;
}

export class ApiDailyWorksColumnTable {

    static createColumns = async () => {
        try {
            const columns = createDailyWorkColumns(await plantData(), await attelierData(), await timeScheduleData(), await manteinanceData(), await manteinanceActionData());
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