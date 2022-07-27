import { dao } from '../server.js';
import { HolidayScoreColumnTable } from '../utils/holidayScoresColumnTable.js';
import { saveHolidaysDTO, holidayScoreRespDTO } from '../model/DTOs/holidays.js';
import { loggerError, loggerInfo } from '../utils/logger.js';
import { ApiEmployee } from './employees.js';


const getPeriodsForSelectForm = (holidays) => {
    try {
        const holidaysSelect = holidays.map(holiday => {
            return {
                id: holiday._id.toString(),
                name: holiday.periodName,
            }
        });
        return holidaysSelect;
    } catch (err) {
        loggerError.error(err);
    }
}



export class ApiHoliday {

    createPeriod = async (newPeriod) => {
        try {
            const { startDate, endDate } = newPeriod;
            const name = `Período ${new Date(startDate).getFullYear()}-${new Date(endDate).getFullYear()}`;
            const dataToSave = saveHolidaysDTO(name, startDate, endDate);
            const resp = await dao.createPeriod(dataToSave);
            if (resp === 'duplicate') {
                return 'duplicate';
            } else {
                return await this.getData();
            }
        } catch (err) {
            loggerError.error(err);
        }

    }

    getData = async () => {
        try {
            const employeeOptions = await ApiEmployee.getEmployeesForSelectForm();
            const holidays = await dao.getHolidays();
            const periodOptions = getPeriodsForSelectForm(holidays);
            const periodData = holidays.pop();
            return holidayScoreRespDTO(employeeOptions, periodOptions, periodData);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getPeriodPoints = async (date) => {
        try {
            const periodPoints = await dao.getPeriodPoints(date);
            return periodPoints;
        } catch (err) {
            loggerError.error(err);
            return err;
        }
    }

}
