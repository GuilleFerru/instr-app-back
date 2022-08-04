import { dao } from '../server.js';
import { saveHolidaysDTO, holidayScoreRespDTO, holidayPeriodRespDTO, holidayDataDTO } from '../model/DTOs/holidays.js';
import { loggerError } from '../utils/logger.js';
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

const calculatePoints = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let loop = startDate;
    let points = 0;
    const months = [
        { 'Enero': 0 },
        { 'Febrero_quincena_uno': 0 },
        { 'Febrero_quincena_dos': 0 },
        { 'Marzo_quincena_uno': 0 },
        { 'Marzo_quincena_dos': 0 },
        { 'Abril': 0 },
        { 'Mayo': 0 },
        { 'Junio': 0 },
        { 'Julio': 0 },
        { 'Agosto': 0 },
        { 'Septiembre': 0 },
        { 'Octubre': 0 },
        { 'Noviembre': 0 },
        { 'Diciembre_quincena_uno': 0 },
        { 'Diciembre_quincena_dos': 0 },
    ];
    while (loop <= endDate) {
        if (loop.getMonth() === 0) {
            points += 100;
            months[0].Enero += 1;
        } else if (loop.getMonth() === 1 && loop.getDate() <= 15) {
            points += 100;
            months[1].Febrero_quincena_uno += 1;
        } else if (loop.getMonth() === 1 && loop.getDate() >= 16) {
            points += 95;
            months[2].Febrero_quincena_dos += 1;
        } else if (loop.getMonth() === 2 && loop.getDate() <= 15) {
            points += 80;
            months[3].Marzo_quincena_uno += 1;
        } else if (loop.getMonth() === 2 && loop.getDate() >= 16) {
            points += 50;
            months[4].Marzo_quincena_dos += 1;
        } else if (loop.getMonth() === 3) {
            points += 40;
            months[5].Abril += 1;
        } else if (loop.getMonth() === 4) {
            points += 30;
            months[6].Mayo += 1;
        } else if (loop.getMonth() === 5) {
            points += 25;
            months[7].Junio += 1;
        } else if (loop.getMonth() === 6) {
            points += 50;
            months[8].Julio += 1;
        } else if (loop.getMonth() === 7) {
            points += 25;
            months[9].Agosto += 1;
        } else if (loop.getMonth() === 8) {
            points += 25;
            months[10].Septiembre += 1;
        } else if (loop.getMonth() === 9) {
            points += 30;
            months[11].Octubre += 1;
        } else if (loop.getMonth() === 10) {
            points += 40;
            months[12].Noviembre += 1;
        } else if (loop.getMonth() === 11 && loop.getDate() <= 15) {
            points += 50;
            months[13].Diciembre_quincena_uno += 1;
        } else if (loop.getMonth() === 11 && loop.getDate() >= 16) {
            points += 80;
            months[14].Diciembre_quincena_dos += 1;
        }
        loop.setDate(loop.getDate() + 1);
    }
    const qtyDays = months.reduce((acc, curr) => acc + curr[Object.keys(curr)], 0);
    const daysDistribution = months.filter(month => month[Object.keys(month)] !== 0);

    return { points, qtyDays, daysDistribution };
}

const employeeFirstFraction = async (employee, empHolidayData, pointsData) => {
    const apiEmployee = new ApiEmployee();
    const employeeDB = await apiEmployee.getEmployeeBylegajo(employee);
    const actualDays = employeeDB[0].holidayDays;
    const leftDays = actualDays - pointsData.qtyDays;
    const fraction = 1;
    const holidayData = holidayDataDTO(empHolidayData, pointsData, fraction, actualDays, leftDays);
    return holidayData;
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

    createEmployeeHoliday = async (empHolidayData) => {
        try {
            const { employee, periodId, startDate, endDate } = empHolidayData;
            const periodData = await dao.getPerioData(periodId);
            const pointsData = calculatePoints(startDate, endDate);
            const holidayDataDB = periodData[0].holidaysData;
            const holidaysDataToSave = [];

            if (holidayDataDB.length === 0) {
                const holidayData = await employeeFirstFraction(employee, empHolidayData, pointsData);
                holidaysDataToSave.push(...holidayData);
            } else {
                const checkEmpHolidays = holidayDataDB.filter(holiday => holiday.employee === employee);
                if (checkEmpHolidays.length === 0) {
                    const holidayData = await employeeFirstFraction(employee, empHolidayData, pointsData);
                    holidaysDataToSave.push(...holidayDataDB, ...holidayData);
                } else {
                    const fraction = checkEmpHolidays.length + 1;
                    const leftDays = checkEmpHolidays[checkEmpHolidays.length - 1].leftDays - pointsData.qtyDays;
                    const actualDays = checkEmpHolidays[checkEmpHolidays.length - 1].actualDays;
                    const holidayData = holidayDataDTO(empHolidayData, pointsData, fraction, actualDays, leftDays);
                    holidaysDataToSave.push(...holidayDataDB, ...holidayData);
                }
            }
            const resp = await dao.updateHolidayData(periodId, holidaysDataToSave);
            return resp;
        } catch (err) {
            console.log(err)
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
