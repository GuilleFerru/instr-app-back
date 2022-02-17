import { dao } from '../server.js'
import { ApiShift } from './shifts.js';
import { ApiEmployee } from './employees.js';
import { scheduleDTO, newScheduleDTO, updateScheduleDTO } from '../model/DTOs/schedule.js';
import { getForScheduleEmployeesDTO } from '../model/DTOs/employee.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { loggerError, loggerInfo } from '../utils/logger.js'



const getDayShift = async (date) => {
    const apiShift = new ApiShift();
    const dayShiftArr = await apiShift.getShift(date);
    const dayShift = dayShiftArr[0];
    return dayShift;
}

const getEmployees = async () => {
    const apiEmployee = new ApiEmployee();
    const employees = await apiEmployee.getEmployees();
    return employees;
}


export class ApiSchedule {

    createSchedule = async (date) => {
        try {
            // llamadas a las bases de datos para buscar información
            const dayShift = await getDayShift(date);
            const employees = await getEmployees();
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

            // crear un nuevo objeto con la información del dia y la lista de horarios
            const newSchedule = newScheduleDTO(date, schedule, timeScheduleForScheduleDTO(timeSchedule), getForScheduleEmployeesDTO(employees), aditionals);
            await dao.createSchedule(newSchedule);
            return newSchedule;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createSchedule');
        }
    }

    getSchedule = async (date) => {
        try {
            if (date) {
                const resultado = await dao.getSchedule(date);
                if (resultado.length > 0) {
                    // devuelvo el objeto con la información del dia y la lista de horarios
                    return resultado[0];
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateSchedule = async (date, schedule) => {
        try {
            if (date && schedule) {
                const newSchedule = schedule.map(element => {
                    return updateScheduleDTO(element);
                });
                
                const resultado = await dao.updateSchedule(date, newSchedule);
                if (resultado) {
                    return resultado;
                } else {
                    return false;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}
