import { dao } from '../server.js';
import { loggerError, loggerInfo } from './logger.js';

const createPlantShutdownsColumns = () => {
    const columns = [
        {
            field: '_id',
            title: 'Numero',
            hidden: true,
        },
        {
            field: "name",
            title: "Nombre",
            type: "string",
            width : "20%"
        },
        {
            field: 'beginDate',
            title: 'Fecha de inicio',
            type: 'date',
            dateSetting: { locale: 'es-AR', format: 'dd-MMM-yyyy' },
            editable: 'never',
            width: "15%"

        },
        {
            field: 'endDate',
            title: 'Fecha de finalización',
            type: 'date',
            dateSetting: { locale: 'es-AR', format: 'dd-MMM-yyyy' },
            editable: 'never',
            width: "15%"
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
                'RE': 'Reprogramado',
            },
            initialEditValue: 'C',
            width: "10%"
        }
    ];
    return columns;
}

export class PlantShutdownTable {

    static createColumns = async () => {
        try {
            const columns = createPlantShutdownsColumns();
            const saveColumns = { columns: columns };
            const resp = await dao.createPlantShutdownsColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getPlantShutdownsColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    // static getColumnsId = async () => {
    //     try {
    //         const resp = await dao.getIdDailyWorkRoutineColumns();
    //         return resp;
    //     } catch (err) {
    //         loggerError.error(err);
    //     } finally {
    //     }
    // }

    static deleteColumns = async (id) => {
        try {
            const resp = await dao.deletePlantShutdownsColumns(id);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}