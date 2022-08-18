import { dao } from '../server.js';
import { getForScheduleEmployeesDTO } from '../model/DTOs/employee.js';

import { loggerError, loggerInfo } from '../utils/logger.js'
import { reduceForLookUp } from '../utils/reduceForLookup.js';

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
}
