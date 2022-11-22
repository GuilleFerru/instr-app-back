import { dao } from '../server.js'
import { ApiShift } from './shifts.js';
import { ApiEmployee } from './employees.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { formatDate, dateInLocalDate, getDayName, monthAndYearString } from '../utils/formatDate.js';
import { scheduleDTO, saveScheduleDTO, returnScheduleDTO, updateScheduleDTO } from '../model/DTOs/schedule.js';
import { getForScheduleEmployeesDTO } from '../model/DTOs/employee.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { loggerError, loggerInfo } from '../utils/logger.js'
import excel from 'exceljs';

const apiEmployee = new ApiEmployee();

const normalizeShifts = (employees, element) => {
    const emp = employees.find(employee => employee.shiftType !== element.shiftType && employee.legajo === element.legajo);
    if (emp) {
        element.shiftType = emp.shiftType;
    }
}

const checkChangesRotativeShifts = (element, employees) => {
    const { id, legajo, fullName, timeSchedule, workedHours, shiftType, ...rest } = element
    if (!(JSON.stringify(rest) === '{}')) {
        Object.entries(rest).forEach(item => {
            if (!(item[0].endsWith('info')) && item[1] === '25' && shiftType === 'dailyShift') {
                element.shiftType = 'rotativeShift';
            } else if (!(item[0].endsWith('info')) && item[1] === '0') {
                normalizeShifts(employees, element)
            }
        })
    } else {
        normalizeShifts(employees, element)
    }
}

export const getDayShift = async (date) => {
    const apiShift = new ApiShift();
    const dayShiftArr = await apiShift.getShift(date);
    const dayShift = dayShiftArr[0];
    return dayShift;
}

const getEmployees = async (filter, legajo) => {
    let employees;
    if (filter === 'all') {
        employees = await apiEmployee.getEmployees();
    } else if (filter === 'byLegajo') {
        employees = await apiEmployee.getEmployeeBylegajo(legajo);
    }
    return employees;
}

const getActualShift = (hour) => {
    if (hour >= 5 && hour < 13) {
        return 1;
    }
    if (hour >= 13 && hour < 21) {
        return 2;
    } else {
        return 3;
    }

}

const createScheduleColumns = (timeSchedule, employeesForSchedule) => {
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
        },
        {
            field: 'fullName',
            title: 'Nombre Completo',
            lookup: reduceForLookUp(employeesForSchedule),
        },
        {
            field: 'timeSchedule',
            title: 'Horario',
            lookup: reduceForLookUp(timeSchedule),
        },
        {
            field: 'workedHours',
            title: 'Horas Trabajadas',
            align: 'left',
            type: 'numeric',
        },
    ];
    return columns;
}


const adjustDailyShiftSheetColumnWidth = (sheet, n3) => {

    const lengths = [];
    sheet.getColumn(`${n3}`).values.map((value) => {
        const length = value && value.toString().length;
        lengths.push(length);
    });
    lengths.splice(0, 4);
    lengths.length > 49 ? lengths.splice(49, lengths.length) : '';
    const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
    sheet.getColumn(`${n3}`).width = maxLength + 1;
}

const isNumeric = (value) => {
    return /^\d+$/.test(value);
}

const completeDailyShiftSheet = (firstIterate, weekData, workbook, n1, n2, n3) => {
    for (let i = 0; i < weekData.length; i++) {
        const sheet = workbook.getWorksheet(`SEMANA ${i + 1}`);
        if (weekData[i][n1] !== undefined) {
            const { dateNumber, dayName, date, employees } = weekData[i][n1];
            sheet.getCell(`${n2}4`).value = `${dayName}`;
            sheet.getCell(`${n2}5`).value = parseInt(`${dateNumber}`);
            let cellNumber = 7
            for (let j = 0; j < employees.length; j++) {
                if (firstIterate === true) {
                    const { legajo, fullName } = employees[j];
                    sheet.getCell(`B${cellNumber}`).value = legajo;
                    sheet.getCell(`C${cellNumber}`).value = fullName;
                    sheet.getCell('S2').value = monthAndYearString(date);
                }
                const { aditionals } = employees[j];
                for (let k = 0; k < aditionals.length; k++) {
                    const { ...rest } = aditionals[k];
                    sheet.getCell(`${n2}${cellNumber}`).value = rest.additional_1 ? Number(rest.additional_1) : '';
                    sheet.getCell(`${n3}${cellNumber}`).value = rest.additional_1_info ? isNumeric(rest.additional_1_info) ? Number(rest.additional_1_info) : rest.additional_1_info : '';
                    sheet.getCell(`${n2}${cellNumber + 1}`).value = rest.additional_2 ? Number(rest.additional_2) : '';
                    sheet.getCell(`${n3}${cellNumber + 1}`).value = rest.additional_2_info ? isNumeric(rest.additional_2_info) ? Number(rest.additional_2_info) : rest.additional_2_info : '';
                    sheet.getCell(`${n2}${cellNumber + 2}`).value = rest.additional_3 ? Number(rest.additional_3) : '';
                    sheet.getCell(`${n3}${cellNumber + 2}`).value = rest.additional_3_info ? isNumeric(rest.additional_3_info) ? Number(rest.additional_3_info) : rest.additional_3_info : '';
                    sheet.getCell(`${n2}${cellNumber + 3}`).value = rest.additional_4 ? Number(rest.additional_4) : '';
                    sheet.getCell(`${n3}${cellNumber + 3}`).value = rest.additional_4_info ? isNumeric(rest.additional_4_info) ? Number(rest.additional_4_info) : rest.additional_4_info : '';
                }
                cellNumber += 4;
            }
            adjustDailyShiftSheetColumnWidth(sheet, n3);
        }
    }
}

const qtyEmployessForDashboard = (employees) => {
    const qtyEmployes = employees.filter((employee) => employee.workedHours > 0 && (employee.timeSchedule === 5 || employee.timeSchedule === 6)).length;
    return qtyEmployes;
}


export class ApiSchedule {

    handleSocket = async (...data) => {
        try {
            const { date, socket, action, scheduleData, roomId, io } = data[0];
            if (action === 'get_schedule') {
                const data = await this.getSchedule(date);
                data && socket.emit('get_schedule', data);
            } else if (action === 'update_schedule') {
                await this.updateSchedule(date, scheduleData, roomId);
                io.to(roomId).emit('get_schedule', await this.getSchedule(date));
            } else if (action === 'update_schedule_columns') {
                await this.updateScheduleColumns(date, scheduleData);
                //io.to(roomId).emit('get_schedule', await this.getSchedule(date));
            } else if (action === 'delete_schedule') {
                await this.deleteSchedule(scheduleData);
                io.to(roomId).emit('get_schedule', await this.getSchedule(date));
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    createSchedule = async (date) => {
        try {
            // llamadas a las bases de datos para buscar información
            const dateLocal = formatDate(date);
            const dayShift = await getDayShift(dateLocal);
            const employees = await getEmployees('all');
            const workHours = await dao.getWorkHours();
            const timeSchedule = await dao.getTimeSchedule();
            const aditionals = await dao.getAditionals();
            const shiftWorkHours = workHours.find(workHour => workHour.schedule === 'T').hour;
            const dailyWorkHours = workHours.find(workHour => workHour.schedule === 'D').hour;

            // crear una nueva lista de horarios para el dia guardado en dayShift
            const schedule = employees.map(employee => {
                const shift = dayShift.shifts.find(shift => shift.shift === employee.shift);
                const shiftSchedule = shift.schedule;
                const currentTimeSchedule = timeSchedule.find(eLement => eLement.schedule == shiftSchedule);
                const workedHours = shiftSchedule === 'F' ? 0 : shiftSchedule === 'D' || shiftSchedule === 'D1' ? dailyWorkHours : shiftWorkHours;
                const schedule = scheduleDTO(employee, currentTimeSchedule, workedHours);
                return schedule;
            });
            //creo la columna base de la tabla con los lookups del horario y el nombre completo
            const columns = createScheduleColumns(timeScheduleForScheduleDTO(timeSchedule), getForScheduleEmployeesDTO(employees));
            const saveSchedule = saveScheduleDTO(dateLocal, schedule, columns);
            const result = await dao.createSchedule(saveSchedule);
            const _id = result[0]._id
            const returnSchedule = returnScheduleDTO(dateLocal, schedule, columns, reduceForLookUp(aditionals), _id);
            return returnSchedule;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createSchedule');
        }
    }

    getSchedule = async (date) => {
        try {
            const dateLocalDate = dateInLocalDate(date);
            if (dateLocalDate >= new Date('2022-01-01')) {
                const dateLocal = formatDate(date);
                const resultado = await dao.getSchedule(dateLocal);
                if (resultado.length === 0) {
                    return await this.createSchedule(date);
                } else if (resultado.length > 0) {
                    const aditionals = await dao.getAditionals();
                    const returnSchedule = returnScheduleDTO(resultado[0].date, resultado[0].schedule, resultado[0].columns, reduceForLookUp(aditionals), resultado[0]._id);
                    return returnSchedule;
                } else {
                    return false;
                }
            } else {
                return [''];
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    updateSchedule = async (date, schedule) => {
        try {
            const dateLocal = formatDate(date);
            const employees = await getEmployees('all');
            if (dateLocal && schedule) {
                const newSchedule = schedule.map(element => {
                    checkChangesRotativeShifts(element, employees)
                    return updateScheduleDTO(element);
                });
                const resultado = await dao.updateSchedule(dateLocal, newSchedule);
                if (resultado) {
                    return resultado;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.error(error)
            loggerError.error(error);
        }
    }

    updateScheduleColumns = async (date, columns) => {
        try {
            const dateLocal = formatDate(date);
            if (dateLocal && columns) {
                const resultado = await dao.updateScheduleColumns(dateLocal, columns)
                if (resultado) {
                    return resultado;
                } else {
                    return false;
                }
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    deleteSchedule = async (data) => {
        try {

            const { date, dataDelete } = data;
            const schedule = await dao.deleteSchedule(formatDate(date), dataDelete);
            const checkSchedule = await dao.getSchedule(formatDate(date));
            const emptySchedule = checkSchedule[0].schedule.length;
            if (emptySchedule === 0) {
                await dao.deleteAllSchedule(formatDate(date));
            }
            return schedule;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('deleteSchedule');
        }
    }

    getDailyShiftExcel = async (data) => {
        try {
            const { startDate, endDate } = data;
            const schedules = await dao.getSchedulesBettweenDates(startDate, endDate);
            const employees = await getEmployees('all');
            const workbook = new excel.Workbook();
            await workbook.xlsx.readFile('./data/dailyShiftTemplate.xlsx');

            const dataForSheet = [];
            let dayEmployees = [];
            for (const element of schedules) {
                const { schedule, dateTime } = element;
                const dayNumber = dateTime.getDay();
                const dateNumber = dateTime.getDate();
                const dataObject = {
                    dateNumber: dateNumber,
                    dayName: getDayName(dayNumber),
                    date: dateTime
                }
                for (let i = 0; i < schedule.length; i++) {
                    const { id, legajo, fullName, timeSchedule, workedHours, shiftType, ...rest } = schedule[i];
                    const { nombre, apellido } = employees[i];
                    dayEmployees.push({
                        legajo: legajo,
                        fullName: `${nombre} ${apellido}`,
                        aditionals: Object.keys(rest).length === 0 ? [{}] : [rest],
                    })
                    dataObject.employees = dayEmployees;
                }
                dayEmployees = [];
                dataForSheet.push(dataObject);
            }

            const weekData = []
            do {
                weekData.push(dataForSheet.splice(0, 7));
            } while (dataForSheet.length > 7)
            weekData.push(dataForSheet.splice(0));

            const weekQty = weekData.length;
            for (let i = 1; i < weekQty; i++) {
                const showSheet = workbook.getWorksheet(`SEMANA ${i + 1}`)
                showSheet.state = 'visible';
            }
            completeDailyShiftSheet(true, weekData, workbook, 0, 'D', 'E')
            completeDailyShiftSheet(false, weekData, workbook, 1, 'F', 'G')
            completeDailyShiftSheet(false, weekData, workbook, 2, 'H', 'I')
            completeDailyShiftSheet(false, weekData, workbook, 3, 'J', 'K')
            completeDailyShiftSheet(false, weekData, workbook, 4, 'L', 'M')
            completeDailyShiftSheet(false, weekData, workbook, 5, 'N', 'O')
            completeDailyShiftSheet(false, weekData, workbook, 6, 'P', 'Q')
            return workbook;
        } catch (err) {
            loggerError.error(err);
        }
    }

    getScheduleForWidgetDashboard = async (date) => {
        try {

            const schedule = await dao.getSchedule(formatDate(date));
            const employees = await getEmployees('all');
            const regularEmployees = [];
            const othersEmployees = [];

            // Obtengo cantidad de supervisores y afiliados que estan trabajando hoy...
            if (schedule.length > 0) {
                for (const employee of employees) {
                    for (const dayEmployee of schedule[0].schedule) {
                        if (employee.legajo === dayEmployee.legajo && employee.condicion === 'Afiliado') {
                            regularEmployees.push(dayEmployee);
                        } else if (employee.legajo === dayEmployee.legajo && employee.condicion === 'Fuera de convenio') {
                            othersEmployees.push(dayEmployee);
                        }
                    }
                }

                // busco quien es el encargado del turno según la hora que sea.
                const actualHour = new Date(date).getHours();
                const actualShift = getActualShift(actualHour);
                const shiftEmployeeLegajo = schedule[0].schedule.filter(employee => employee.timeSchedule.toString() === actualShift.toString() && employee.workedHours > 0);
                const getEmployee = [];

                // sino hay nadie de turno en el horario normal, lo busco en las horas extras.
                if (shiftEmployeeLegajo.length === 0) {
                    for (const scheduleEmp of schedule[0].schedule) {
                        if (scheduleEmp.workedHours > 0) {
                            if (Number(scheduleEmp.timeSchedule.toString()) > 6 && Number(scheduleEmp.workedHours.toString()) > 8 && scheduleEmp.shiftType === 'rotativeShift') {
                                getEmployee.push(await apiEmployee.getEmployeeBylegajo(scheduleEmp.legajo));
                            }
                        }
                    }
                } else {
                    getEmployee.push(shiftEmployeeLegajo.length !== 0 && await apiEmployee.getEmployeeBylegajo(shiftEmployeeLegajo[0].legajo));
                }
                const employeeName = getEmployee.length !== 0 ? `${getEmployee[0][0].nombre} ${getEmployee[0][0].apellido}` : 'N/A';
                const dashboardSchedule = [qtyEmployessForDashboard(regularEmployees), employeeName, qtyEmployessForDashboard(othersEmployees)];
                return dashboardSchedule;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
        }


    }
}


