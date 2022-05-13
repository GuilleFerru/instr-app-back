import { dao } from '../server.js';
import { plantData, attelierData, timeScheduleData, manteinanceData, manteinanceActionData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createOthersRoutinesColumns = (plantsForColumnTable, atteliersForColumnTable) => {
    const columns = [
        {
            field: '_id',
            title: 'Numero',
            hidden: true,
        },
        {
            field: 'nickname',
            title: 'Nombre',
            defaultGroupOrder: 0,
        },
        {
            field: 'plant',
            title: 'Planta',
            lookup: plantsForColumnTable,
            editable: 'never',
            width: "10%"
        },
        {
            field: 'attelier',
            title: 'Attelier',
            lookup: atteliersForColumnTable,
            hidden: true,
        },
        {
            field: 'tag',
            title: 'TAG',
            type: 'string',
            editable: 'never',
            width: "10%"
        },
        {
            field: 'checkDay',
            title: 'Dia de Revisión',
            type: 'date',
            dateSetting: { locale: 'es-AR', format: 'dd-MMM-yyyy' },
            editable: 'never',
            width: "30%"
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            align: 'left',
            width: "10%"
        },
        {
            field: 'description',
            title: 'Descripción',
            multiline: true,
            editable: 'never',
            width: '20%',
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
            initialEditValue: 'P',
            editable: 'never',
            width: '10%',
        },
        {
            field: 'filePath',
            title: 'Adjuntar archivo',
            width: '10%',
        }
    ];
    return columns;
}

export class OthersRoutineColumnTable {

    static createColumns = async () => {
        try {
            const columns = createOthersRoutinesColumns(await plantData(), await attelierData());
            const saveColumns = { columns: columns };
            const resp = await dao.createOthersRoutinesColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getOtherRoutinesColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    // static getColumnsId = async () => {
    //     try {
    //         const resp = await dao.();
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