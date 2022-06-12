import { dao } from '../server.js';
import {manteinanceData, manteinanceActionData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createShutdownDailyWorksColumns = (manteinancesForColumnTable, manteinanceActionsForColumnTable) => {
    const columns = [
        {
            field: 'id',
            title: 'Numero',
            hidden: true,
        },
        {
            field: 'beginDate',
            title: 'Fecha de inicio',
            type: 'date',
            dateSetting: { locale: 'es-AR', format: 'dd-MMM-yyyy' },
            defaultSort: 'asc',
            width: "15%"
        },
        {
            field: 'manteinance',
            title: 'Tipo de mto',
            lookup: manteinancesForColumnTable,
            initialEditValue: '1',
            width: "15%"
            // defaultGroupSort: 'desc'
        },
        {
            field: 'action',
            title: 'Acción',
            lookup: manteinanceActionsForColumnTable,
            initialEditValue: "1",
            width: "20%"
        },
        {
            field: 'description',
            title: 'Descripción',
            multiline: true,
            align : "justify",
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
                'PP': 'Paro de planta',
            },
            width: "10%"
        }
    ];
    return columns;
}

export class PlantShutdownDailyWorksColumnTable {

    static createColumns = async () => {
        try {
            const columns = createShutdownDailyWorksColumns( await manteinanceData(), await manteinanceActionData());
            const saveColumns = { columns: columns };
            const resp = await dao.createPlantShutdownDailyWorksColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }
    
    static getColumns = async () => {
        try {
            const resp = await dao.getPlantShutdownDailyWorksColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    // static getColumnsId = async () => {
    //     try {
    //         const resp = await dao.getIdDailyWorkColumns();
    //         return resp;
    //     } catch (err) {
    //         loggerError.error(err);
    //     } finally {
    //     }
    // }

    // static deleteColumns = async (id) => {
    //     try {
    //         const resp = await dao.deleteDailyWorksColumns(id);
    //         return resp;
    //     } catch (err) {
    //         loggerError.error(err);
    //     } finally {
    //     }
    // }

}