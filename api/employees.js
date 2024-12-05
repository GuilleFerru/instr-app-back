import { dao } from '../server.js';
import { getForScheduleEmployeesDTO, employeesDTO, updateEmployeeDTO,filterActiveEmployeesDTO } from '../model/DTOs/employee.js';
import { scheduleUpdateDTO } from '../model/DTOs/scheduleUpdate.js';
import { dateInLocalDate } from '../utils/formatDate.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiTimeSchedule } from './timeSchedules.js';
import { ApiScheduleUpdate } from './scheduleUpdates.js'
import { getDayShift } from './schedules.js';
import { loggerError, loggerInfo } from '../utils/logger.js'
import { ObjectId } from 'mongodb';

const apiTimeSchedule = new ApiTimeSchedule();
const apiScheduleUpdate = new ApiScheduleUpdate();



export class ApiEmployee {



    getDataForUpdateSchedule = async () => {
        try {
            const timeSchedule = await dao.getTimeSchedule();
            const workHours = await dao.getWorkHours();
            const shiftWorkHours = workHours.find(workHour => workHour.schedule === 'T').hour;
            const dailyWorkHours = workHours.find(workHour => workHour.schedule === 'D').hour;
            return { timeSchedule, shiftWorkHours, dailyWorkHours }
        } catch (err) {

        }
    }




    createEmployee = async (employee) => {
        try {
            const emp = await dao.createEmployee(employee);
            const { timeSchedule, shiftWorkHours, dailyWorkHours } = await this.getDataForUpdateSchedule();
            const hireDate = dateInLocalDate(employee.hireDate);
            const schedulesFromHireDate = await dao.getSchedulesFromToday(hireDate);

            if (emp) {
                schedulesFromHireDate.forEach(async (schedule) => {
                    const dayShift = await getDayShift(schedule.date);
                    const shift = dayShift.shifts.find(shift => shift.shift === emp[0].shift);
                    const shiftSchedule = shift.schedule;
                    const currentTimeSchedule = timeSchedule.find(eLement => eLement.schedule == shiftSchedule);
                    const workedHours = shiftSchedule === 'F' ? 0 : shiftSchedule === 'D' || shiftSchedule === 'D1' ? dailyWorkHours : shiftWorkHours;

                    const scheduleEmployee = {
                        id: ObjectId.createFromHexString(emp[0].id),
                        legajo: emp[0].legajo,
                        fullName: emp[0].legajo,
                        timeSchedule: currentTimeSchedule.id,
                        workedHours: workedHours,
                        shiftType: emp[0].shiftType
                    }
                    const currentSchedule = schedule.schedule;
                    currentSchedule.push(scheduleEmployee);

                    const legajoToString = emp[0].legajo.toString();
                    schedule.columns[2].lookup[legajoToString] = `${emp[0].nombre} ${emp[0].apellido} `

                    await dao.updateSchedule(schedule.date, currentSchedule, schedule.columns);
                })
            }
            const empResp = await this.getEmployeesData();
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
            return filterActiveEmployeesDTO(empResp);
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
            console
            const empSelect = empResp.map(emp => {
                return {
                    id: emp.legajo,
                    name: `${emp.nombre} ${emp.apellido}`,
                    holidayDays: emp.holidayDays,
                    employeeCondition: emp.condicion,
                    shiftType: emp.shiftType,
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
                // if (newEmployee.shift !== employeeDb[0].shift || newEmployee.shiftType !== employeeDb[0].shiftType) {
                const { timeSchedule, shiftWorkHours, dailyWorkHours } = await this.getDataForUpdateSchedule();
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
                    const legajoToString = newEmployee.legajo.toString();
                    schedule.columns[2].lookup[legajoToString] = `${newEmployee.nombre} ${newEmployee.apellido} `
                    await dao.updateSchedule(schedule.date, newSchedule, schedule.columns);
                });
                await apiScheduleUpdate.createScheduleUpdate(scheduleUpdateDTO(newEmployee, employeeDb[0]));
                //}
                return empResp;
            } else {
                return undefined;
            }
        } catch (err) {
            loggerError.error(err);
        }

    }


}