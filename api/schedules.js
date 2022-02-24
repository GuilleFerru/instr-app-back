import { dao } from '../server.js'
import { ApiShift } from './shifts.js';
import { ApiEmployee } from './employees.js';
import { scheduleDTO, saveScheduleDTO, returnScheduleDTO, updateScheduleDTO } from '../model/DTOs/schedule.js';
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

const reduceForLookUp = (arr) => {
    return arr.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
    }, {});
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
            //creo la columna base de la tabla con los lookups del horario y el nombre completo
            const columns = createScheduleColumns(timeScheduleForScheduleDTO(timeSchedule), getForScheduleEmployeesDTO(employees));

            const saveSchedule = saveScheduleDTO(date, schedule, columns);
            await dao.createSchedule(saveSchedule);

            const returnSchedule = returnScheduleDTO(date, schedule, columns, reduceForLookUp(aditionals));
            return returnSchedule;
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
                    const aditionals = await dao.getAditionals();
                    const returnSchedule = returnScheduleDTO(resultado[0].date, resultado[0].schedule, resultado[0].columns ,reduceForLookUp(aditionals));
                    return returnSchedule;
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

    updateScheduleColumns = async (date, columns) => {
        try {
            if (date && columns) {
                const resultado = await dao.updateScheduleColumns(date, columns)
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
