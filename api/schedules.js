import { dao } from '../server.js'
import { ApiShift } from './shifts.js';
import { ApiEmployee } from './employees.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { formatDate, dateInLocalDate, parseStringToDate } from '../utils/formatDate.js';
import { scheduleDTO, saveScheduleDTO, returnScheduleDTO, updateScheduleDTO } from '../model/DTOs/schedule.js';
import { getForScheduleEmployeesDTO } from '../model/DTOs/employee.js';
import { timeScheduleForScheduleDTO } from '../model/DTOs/timeSchedule.js';
import { loggerError, loggerInfo } from '../utils/logger.js'


//MODIFICAR Y DEJAR IGUAL A DAILY WORKS... USAR LOS METODOS ESTATICOS 


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

    handleSocket = async (...data) => {
        try {
            const { date, socket, action, scheduleData, roomId, io } = data[0];
            if (action === 'get_schedule') {
                const data = await this.getSchedule(date);
                data && socket.emit('get_schedule', data);
            } else if (action === 'update_schedule') {
                await this.updateSchedule(date, scheduleData, roomId);
                socket.to(roomId).emit('get_schedule', await this.getSchedule(date));
            } else if (action === 'update_schedule_columns') {
                await this.updateScheduleColumns(date, scheduleData);
                await io.to(roomId).emit('get_schedule', await this.getSchedule(date));
                // socket.emit('updateScheduleColumns', data);
            } else if (action === 'delete_schedule') {
                await this.deleteSchedule(scheduleData);
                //este emit no me anda y no se porque ... 6-5-22
                await io.to(roomId).emit('get_schedule', await this.getSchedule(date));
            }
        } catch (error) {
            console.error(error);
            loggerError.error(error);
        }
    }


    createSchedule = async (date) => {
        try {
            // llamadas a las bases de datos para buscar información
            const dateLocal = formatDate(date);
            const dayShift = await getDayShift(dateLocal);
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
                    const schedule = await this.createSchedule(date);
                    return schedule;
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
            console.log(error);
        }
    }

    updateSchedule = async (date, schedule) => {
        try {
            const dateLocal = formatDate(date);
            if (dateLocal && schedule) {
                const newSchedule = schedule.map(element => {
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
            console.log(error);
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
            console.log(error);
        }
    }

    deleteSchedule = async (data) => {
        try {

            const { date, dataDelete } = data;
            const schedule = await dao.deleteSchedule(formatDate(date), dataDelete);
            return schedule;
        } catch (err) {
            console.log(err);
            loggerError.error(err);
        } finally {
            loggerInfo.info('deleteSchedule');
        }
    }

    // convertDateToDate = async () => {
    //     try {

    //         const schedules = await dao.getSchedules();
    //         for (let i = 0; i < schedules.length; i++) {
    //             const schedule = schedules[i];
    //             const dateTime = parseStringToDate(schedule.date);
    //             await dao.updateDateTime(schedule.date, dateTime);
    //         }
    //         const result = true;
    //         return result;
    //     } catch (error) {
    //         console.log(error);
    //         loggerError.error(error);
    //     }
    // }
}


