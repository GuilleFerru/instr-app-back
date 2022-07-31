import { dao } from '../server.js';
import { formatDate } from '../utils/formatDate.js';
import { saveHolidaysDTO, holidayScoreRespDTO, holidayPeriodRespDTO } from '../model/DTOs/holidays.js';
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


    handleSocket = async (...data) => {
        try {
            const { date, socket, action, holidayData, roomId, io } = data[0];

            if (action === 'get_holiday_data') {
                const data = await this.getData(date);
                data && socket.emit('get_holiday_data', data);
            } else if (action === 'delete_holiday_period') {
                const data = await this.deletePeriod(holidayData);
                data && socket.emit('get_holiday_data', await this.getData(date));
            } else if (action === 'get_holiday_period') {
                const data = await this.getPerioData(holidayData);
                data && socket.emit('get_holiday_period', data);
            } else if (action === 'create_employee_holiday') {
                const data = await this.createEmployeeHoliday(holidayData);
                //data && socket.emit('get_holiday_data', await this.getData(date));
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    createPeriod = async (newPeriod) => {
        try {
            const { startDate, endDate } = newPeriod;
            const name = `Período ${new Date(startDate).getFullYear()}-${new Date(endDate).getFullYear()}`;
            const dataToSave = saveHolidaysDTO(name, startDate, endDate);
            const resp = await dao.createPeriod(dataToSave);
            if (resp === 'duplicate') {
                return 'duplicate';
            } else {
                return true;
            }
        } catch (err) {
            loggerError.error(err);
        }

    }

    createEmployeeHoliday = async (empData) => {
        try {
            //console.log(empData);
            //const { employeeId, periodId, date } = holidayData;
            //const dataToSave = saveHolidaysDTO(employeeId, periodId, date);
            //const resp = await dao.createEmployeeHoliday(dataToSave);
            return true;

        } catch (err) {
            loggerError.error(err);
        }
    }


    getData = async (date) => {
        try {
            const employeeOptions = await ApiEmployee.getEmployeesForSelectForm();
            const holidays = await dao.getHolidays();
            const periodOptions = getPeriodsForSelectForm(holidays);
            const getCurrentPeriod = holidays.filter(holiday => {
                return new Date(holiday.startDate) <= new Date(date) && new Date(holiday.endDate) >= new Date(date);
            });
            return holidayScoreRespDTO(employeeOptions, periodOptions, ...getCurrentPeriod);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getPerioData = async (periodId) => {
        try {
            const period = await dao.getPerioData(periodId);
            return holidayPeriodRespDTO(...period);
        } catch (err) {
            loggerError.error(err);
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

    deletePeriod = async (periodId) => {
        try {
            const resp = await dao.deletePeriod(periodId);
            return resp;
        } catch (err) {
            loggerError.error(err);
            return err;
        }
    }

}
