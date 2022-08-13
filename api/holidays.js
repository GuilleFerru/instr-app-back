import { dao } from '../server.js';
import { saveHolidaysDTO, holidayScoreRespDTO, holidayPeriodRespDTO, holidayDataDTO } from '../model/DTOs/holidays.js';
import { formatDate } from '../utils/formatDate.js';
import { loggerError } from '../utils/logger.js';
import { ApiEmployee } from './employees.js';
import { ApiSchedule } from './schedules.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';

const apiSchedule = new ApiSchedule();


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
        { 'Enero': 0, 'points': 0 },
        { 'Febrero_quincena_uno': 0, 'points': 0 },
        { 'Febrero_quincena_dos': 0, 'points': 0 },
        { 'Marzo_quincena_uno': 0, 'points': 0 },
        { 'Marzo_quincena_dos': 0, 'points': 0 },
        { 'Abril': 0, 'points': 0 },
        { 'Mayo': 0, 'points': 0 },
        { 'Junio': 0, 'points': 0 },
        { 'Julio': 0, 'points': 0 },
        { 'Agosto': 0, 'points': 0 },
        { 'Septiembre': 0, 'points': 0 },
        { 'Octubre': 0, 'points': 0 },
        { 'Noviembre': 0, 'points': 0 },
        { 'Diciembre_quincena_uno': 0, 'points': 0 },
        { 'Diciembre_quincena_dos': 0, 'points': 0 },
    ];
    while (loop <= endDate) {
        if (loop.getMonth() === 0) {
            points += 100;
            months[0].Enero += 1;
            months[0].points += 100;
        } else if (loop.getMonth() === 1 && loop.getDate() <= 15) {
            points += 100;
            months[1].Febrero_quincena_uno += 1;
            months[1].points += 100;
        } else if (loop.getMonth() === 1 && loop.getDate() >= 16) {
            points += 95;
            months[2].Febrero_quincena_dos += 1;
            months[2].points += 95;
        } else if (loop.getMonth() === 2 && loop.getDate() <= 15) {
            points += 80;
            months[3].Marzo_quincena_uno += 1;
            months[3].points += 80;
        } else if (loop.getMonth() === 2 && loop.getDate() >= 16) {
            points += 50;
            months[4].Marzo_quincena_dos += 1;
            months[4].points += 50;
        } else if (loop.getMonth() === 3) {
            points += 40;
            months[5].Abril += 1;
            months[5].points += 40;
        } else if (loop.getMonth() === 4) {
            points += 30;
            months[6].Mayo += 1;
            months[6].points += 30;
        } else if (loop.getMonth() === 5) {
            points += 25;
            months[7].Junio += 1;
            months[7].points += 25;
        } else if (loop.getMonth() === 6) {
            points += 50;
            months[8].Julio += 1;
            months[8].points += 50;
        } else if (loop.getMonth() === 7) {
            points += 25;
            months[9].Agosto += 1;
            months[9].points += 25;
        } else if (loop.getMonth() === 8) {
            points += 25;
            months[10].Septiembre += 1;
            months[10].points += 25;
        } else if (loop.getMonth() === 9) {
            points += 30;
            months[11].Octubre += 1;
            months[11].points += 30;
        } else if (loop.getMonth() === 10) {
            points += 40;
            months[12].Noviembre += 1;
            months[12].points += 40;
        } else if (loop.getMonth() === 11 && loop.getDate() <= 15) {
            points += 50;
            months[13].Diciembre_quincena_uno += 1;
            months[13].points += 50;
        } else if (loop.getMonth() === 11 && loop.getDate() >= 16) {
            points += 80;
            months[14].Diciembre_quincena_dos += 1;
            months[14].points += 80;
        }
        loop.setDate(loop.getDate() + 1);
    }
    const qtyDays = months.reduce((acc, curr) => acc + curr[Object.keys(curr)[0]], 0);
    const daysDistribution = months.filter(month => month[Object.keys(month)[0]] !== 0);


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
                const data = await this.getData(date, holidayData);
                data && socket.emit('get_holiday_data', data);
            } else if (action === 'delete_holiday_period') {
                const data = await this.deletePeriod(holidayData);
                data && socket.emit('get_holiday_data', await this.getData(date));
            } else if (action === 'get_holiday_period') {
                const data = await this.getPerioData(holidayData);
                data && socket.emit('get_holiday_period', data);
            } else if (action === 'create_employee_holiday') {
                const periodId = await this.createEmployeeHoliday(holidayData);
                socket.emit('create_employee_holiday');
                periodId && socket.emit('get_holiday_data', await this.getData(undefined, periodId));
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

    addHolidayToSchedule = async (schedules, employee, lookup, dateLocal) => {
        schedules[0].schedule.map((schedule) => {
            if (schedule.legajo === employee) {
                const { id, legajo, fullName, timeSchedule, workedHours, shiftType, ...rest } = schedule;
                let flag = false;
                let availableAdditional = 1;
                if (Object.keys(rest).length > 0) {
                    for (let i = 1; i <= Object.keys(rest).length; i++) {
                        if (schedule.hasOwnProperty(`additional_${i}`) && schedule[`additional_${i}`] === '13') {
                            flag = true;
                        } else if (schedule.hasOwnProperty(`additional_${i}`) && schedule[`additional_${i}`] !== '13') {
                            availableAdditional = i + 1;
                        }
                    }
                }
                if (!flag) {
                    schedule[`additional_${availableAdditional}`] = '13';
                    schedule[`additional_${availableAdditional}_info`] = '';
                    let columnExists = false;
                    schedules[0].columns.map(column => {
                        if (column.field === `additional_${availableAdditional}`) {
                            columnExists = true;
                        }
                    })
                    if (!columnExists) {
                        const additionalColum = {
                            field: `additional_${availableAdditional}`,
                            title: `Adicional ${availableAdditional}`,
                            lookup: lookup,
                            align: 'left',
                        }
                        const additionalInfoColum = {
                            field: `additional_${availableAdditional}_info`,
                            title: `Anexo ${availableAdditional}`,
                            align: 'left',
                        }
                        schedules[0].columns.push(additionalColum, additionalInfoColum);
                    }
                    dao.updateSchedulesHolidays(dateLocal, schedules[0].schedule, schedules[0].columns);
                }
            }
        });
    }

    createEmployeeHoliday = async (empHolidayData) => {
        try {
            const { employee, periodId, startDate, endDate, createSchedule } = empHolidayData;
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
                    const holidayData = holidayDataDTO(empHolidayData, pointsData, fraction, actualDays, leftDays, createSchedule);
                    holidaysDataToSave.push(...holidayDataDB, ...holidayData);
                }
            }

            if (createSchedule) {
                let loop = new Date(startDate);
                const loopEnd = new Date(endDate);
                const aditionals = await dao.getAditionals();
                const lookup = reduceForLookUp(aditionals)
                while (loop <= loopEnd) {
                    const dateLocal = formatDate(loop);
                    const scheduleExist = await dao.getSchedule(dateLocal);
                    // si el día esta creado en la tabla schedule
                    if (scheduleExist.length > 0) {
                        const addHolidayToSchedule = await this.addHolidayToSchedule(scheduleExist, employee, lookup, dateLocal);
                    } else {
                        const scheduleResp = await apiSchedule.createSchedule(loop);
                        const { schedule, columns } = scheduleResp;
                        const schedules = [{
                            schedule: schedule,
                            columns: columns,
                        }]
                        const addHolidayToSchedule = await this.addHolidayToSchedule(schedules, employee, lookup, dateLocal);
                    }
                    loop.setDate(loop.getDate() + 1);
                }
            }
            const resp = await dao.updateHolidayData(periodId, holidaysDataToSave);
            if (resp)
                return periodId;
        } catch (err) {
            loggerError.error(err);
        }
    }

    getData = async (date, periodId) => {
        try {
            const employeeOptions = await ApiEmployee.getEmployeesForHolidayForm();
            const holidays = await dao.getHolidays();
            const periodOptions = getPeriodsForSelectForm(holidays);
            const getCurrentPeriod = [];

            if (date) {
                const period = holidays.filter(holiday => {
                    return new Date(holiday.startDate) <= new Date(date) && new Date(holiday.endDate) >= new Date(date);
                });
                getCurrentPeriod.push(period[0]);
            } else {
                const period = holidays.find(holiday => { return holiday.id === periodId });
                getCurrentPeriod.push(period);
            }
            employeeOptions.forEach(employee => {
                const empHolidays = getCurrentPeriod[0].holidaysData.filter(holiday => holiday.employee === employee.id);
                if (empHolidays.length > 0) {
                    const lastFraction = empHolidays[empHolidays.length - 1].fraction;
                    const leftDays = empHolidays.filter(holiday => holiday.fraction === lastFraction)[0].leftDays;
                    employeeOptions.find(emp => emp.id === employee.id).holidayDays = leftDays;
                }
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
