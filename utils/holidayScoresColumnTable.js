import { dao } from '../server.js';
import { employeesData } from './commonLookUpsTables.js';
import { loggerError, loggerInfo } from './logger.js';

const createHolidayScoreColumns = (employeesForColumnTable) => {
    const columns = [
        {
            field: 'id',
            title: 'Numero',
            hidden: true,
        },
        {
            field: 'legajo',
            title: 'Legajo',
            editable: 'never',
            width: "10%"
        },
        {
            field: 'fullName',
            title: 'Nombre Completo',
            lookup: employeesForColumnTable,
            editable: 'never',
            width: "30%"
        },
        {
            field: 'averagePoints',
            title: 'Promedio',
            editable: 'never',
            width: "15%"
        },
        {
            field: 'rotativeShiftResult',
            title: 'Turno',
            editable: 'never',
            width: "15%"
        },
        {
            field: 'dailyShiftResult',
            title: 'Diurno',
            editable: 'never',
            width: "15%"
        },
        {
            field: 'generalResult',
            title: 'General',
            editable: 'never',
            width: "15%"
        }
    ];
    return columns;
}

export class HolidayScoreColumnTable {

    static createColumns = async () => {
        try {
            const columns = createHolidayScoreColumns(await employeesData());
            const saveColumns = { columns: columns };
            const resp = await dao.createHolidayScoreColumns(saveColumns);
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createColumns');
        }
    }

    static getColumns = async () => {
        try {
            const resp = await dao.getHolidayScoreColumns();
            return resp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getColumnsId = async () => {
        try {

        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static deleteColumns = async (id) => {
        try {

        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}