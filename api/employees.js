import { dao } from '../server.js';
import {getForScheduleEmployeesDTO} from '../model/DTOs/employee.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

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
}
