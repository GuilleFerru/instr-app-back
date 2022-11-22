import { dao } from '../server.js';
import { getForScheduleEmployeesDTO, employeesDTO, updateEmployeeDTO } from '../model/DTOs/employee.js';
import { dateInLocalDate } from '../utils/formatDate.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiTimeSchedule } from './timeSchedules.js';
import { getDayShift } from './schedules.js';
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
            const employeeDb = await dao.getEmployeeBylegajo(employee.legajo);
            const newEmployee = updateEmployeeDTO(employee, employeeDb);
            const empUpdate = await dao.updateEmployee(newEmployee);

            if (empUpdate !== undefined) {
                const empResp = await this.getEmployeesData();

                if (newEmployee.shift !== employeeDb[0].shift || newEmployee.shiftType !== employeeDb[0].shiftType) {

                    const timeSchedule = await dao.getTimeSchedule();
                    const workHours = await dao.getWorkHours();
                    const shiftWorkHours = workHours.find(workHour => workHour.schedule === 'T').hour;
                    const dailyWorkHours = workHours.find(workHour => workHour.schedule === 'D').hour;
                    const localDate = dateInLocalDate(new Date())
                    const schedulesFromToday = await dao.getSchedulesFromToday(localDate);

                    schedulesFromToday.forEach(async (schedule) => {

                        const dayShift = await getDayShift(schedule.date);
                        const shift = dayShift.shifts.find(shift => shift.shift === newEmployee.shift);
                        const shiftSchedule = shift.schedule;
                        const currentTimeSchedule = timeSchedule.find(eLement => eLement.schedule == shiftSchedule);
                        const workedHours = shiftSchedule === 'F' ? 0 : shiftSchedule === 'D' || shiftSchedule === 'D1' ? dailyWorkHours : shiftWorkHours;

                        const newSchedule = schedule.schedule.map((emp) => {
                            if (emp.legajo === newEmployee.legajo) {
                                emp.timeSchedule = currentTimeSchedule.id;
                                emp.shiftType = newEmployee.shiftType;
                                emp.workedHours = workedHours;
                            }
                            return emp;
                        });
                        await dao.updateSchedule(schedule.date, newSchedule);
                    });
                }
                return empResp;
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            loggerError.error(err);
        }

    }


}