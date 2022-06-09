import { dao } from '../server.js';
import { plantData, attelierData, manteinanceActionData, plantShutdownsData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createplantShutdownWorksToDoColumns = (plantsForColumnTable, atteliersForColumnTable, plantShutdownForColumnTable) => {
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
            editable: 'never',
            defaultGroupOrder: 0,
            width: "10%",
        },
        {
            field: 'attelier',
            title: 'Attelier',
            lookup: atteliersForColumnTable,
            editable: 'never',
            width: "10%"
        },
        {
            field: 'tag',
            title: 'TAG',
            type: 'string',
            editable: 'never',
            width: "10%"
        },
        {
            field: 'ot',
            title: 'OT',
            type: 'string',
            width: "10%"
        },
        // {
        //     field: 'description',
        //     title: 'Descripción',
        //     multiline: true,
        //     align: "justify",
        //     width: '25%'
        // },
        {
            field : 'description',
            title: 'Trabajo a realizar',
            multiline: true,
            align: "justify",
            width: '40%'
        },
        {
            field: 'plantShutdownId',
            title: 'Asignar a Paro',
            lookup: plantShutdownForColumnTable,
            width: "10%"
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

export class PlantShutdownWorksToDoColumnTable {

    static createColumns = async () => {
        try {
            const columns = createplantShutdownWorksToDoColumns(await plantData(), await attelierData(), await plantShutdownsData());
            const saveColumns = { columns: columns };
            const resp = await dao.createPlantShutdownWorksToDoColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getPlantShutdownWorksToDoColumns();
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

    static deleteColumns = async () => {
        try {
            const resp = await dao.deletePlantShutdownWorksToDoColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}