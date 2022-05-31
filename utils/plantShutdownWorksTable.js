import { dao } from '../server.js';
import { plantData, attelierData, timeScheduleData, manteinanceActionData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createplantShutdownWorksColumns = (plantsForColumnTable, atteliersForColumnTable, timeScheduleForColumnTable, manteinanceActionsForColumnTable) => {
    const columns = [
        {
            field: 'id',
            title: 'Numero',
            hidden: true,
        },
        {
            field: 'plant',
            title: 'Planta',
            lookup: plantsForColumnTable,
            width: "10%",
        },
        {
            field: 'attelier',
            title: 'Attelier',
            lookup: atteliersForColumnTable,
            width: "5%"
        },
        {
            field: 'tag',
            title: 'TAG',
            type: 'string',
            width: "5%"
        },
        {
            field: 'timeSchedule',
            title: 'Horario',
            lookup: timeScheduleForColumnTable,
            initialEditValue: '5',
            width: "5%"
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            width: "5%"
        },
        {
            field: 'action',
            title: 'Acción',
            lookup: manteinanceActionsForColumnTable,
            initialEditValue: "1",
            width: "10%"
        },
        {
            field: 'workToDo',
            title: 'Trabajo a realizar',
            multiline: true,
            align: "justify",
            width: '25%'
        },
        {
            field: 'description',
            title: 'Trabajo realizado',
            multiline: true,
            align: "justify",
            width: '25%'
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
            width: "10%"
        }
    ];
    return columns;
}

export class PlantShutdownWorksColumnTable {

    static createColumns = async () => {
        try {
            const columns = createplantShutdownWorksColumns(await plantData(), await attelierData(), await timeScheduleData(), await manteinanceActionData());
            const saveColumns = { columns: columns };
            const resp = await dao.createPlantShutdownWorksColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getPlantShutdownWorksColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static deleteColumns = async () => {
        try {
            const resp = await dao.deletePlantShutdownWorksColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}