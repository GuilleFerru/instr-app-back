import { dao } from '../server.js';
import { getForScheduleEmployeesDTO, employeesDTO, updateEmployeeDTO } from '../model/DTOs/employee.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { dateInLocalDate } from '../utils/formatDate.js';
import { ApiTimeSchedule } from './timeSchedules.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

const apiTimeSchedule = new ApiTimeSchedule();



export class ApiEmployee {

    createEmployee = async (employee) => {
        try {
            const empResp = await dao.createEmployee(employee);
            return empResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createEmployee');
        }
    }

    getEmployees = async () => {
        try {
            const empResp = await dao.getEmployees();
            return empResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getEmployees');
        }
    }

    getEmployeesData = async () => {
        try {
            const empResp = await dao.getEmployees();
            const timeSchedule = await apiTimeSchedule.getTimeSchedule();
            const schedule = timeScheduleForScheduleDTO(timeSchedule);
            const employees = employeesDTO(empResp, schedule);
            const shiftOptions = [
                {
                    id: 1,
                    name: 'Turno rotativo 1',
                },
                {
                    id: 2,
                    name: 'Turno rotativo 2',
                },
                {
                    id: 3,
                    name: 'Turno rotativo 3',
                },
                {
                    id: 4,
                    name: 'Turno rotativo 4',
                },
                {
                    id: 5,
                    name: 'Diurno de 08:00 a 17:00 hs',
                },
                {
                    id: 6,
                    name: 'Diurno de 07:00 a 16:00 hs',
                },
            ]
            return { employees, shiftOptions };
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getEmployeesData');
        }
    }

    getEmployeeBylegajo = async (legajo) => {
        try {
            const empResp = await dao.getEmployeeBylegajo(legajo);
            return empResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    getForScheduleEmployees = async () => {
        try {
            const empResp = await dao.getEmployees();
            return getForScheduleEmployeesDTO(empResp);
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getForScheduleEmployees');
        }
    }

    static getEmployeesForHolidayForm = async () => {
        try {
            const empResp = await dao.getEmployees();
            const empSelect = empResp.map(emp => {
                return {
                    id: emp.legajo,
                    name: `${emp.nombre} ${emp.apellido}`,
                    holidayDays: emp.holidayDays,
                    employeeCondition: emp.condicion
                }
            });
            // empSelect.unshift({ id: '', name: 'Seleccione un empleado' });
            return empSelect;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

    static getEmployeesForColumnTable = async () => {
        try {
            const empResp = await dao.getEmployees();
            return reduceForLookUp(getForScheduleEmployeesDTO(empResp));
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('getEmployeesForColumnTable');
        }
    }

    updateEmployee = async (employee) => {
        try {
            let date = dateInLocalDate(employee.hireDate);
            date = date.setDate(date.getDate() + 1);
            const newEmployee = updateEmployeeDTO(employee, date);
            const empUpdate = await dao.updateEmployee(newEmployee);
            if (empUpdate !== undefined) {
                const empResp = await this.getEmployeesData();
                return empResp;
            } else {
                return undefined;
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('updateEmployee');
        }
    }
}
