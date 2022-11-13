import { formatDate, dateInLocalDateString, parseStringToDate, parseStringToString } from '../../utils/formatDate.js';

export const employeeDTO = (employee) => ({
    legajo: employee.legajo,
    nombre: employee.nombre,
    apellido: employee.apellido,
    puesto: employee.puesto,
    categoria: employee.categoria
});

export const getForScheduleEmployeesDTO = (employees) => employees.map(employee => ({
    id: employee.legajo,
    name: `${employee.nombre} ${employee.apellido}`,
}));


export const employeesDTO = (employees, schedules) => employees.map(employee => ({
    legajo: employee.legajo,
    nombre: employee.nombre,
    apellido: employee.apellido,
    condicion: employee.condicion,
    puesto: employee.puesto,
    categoria: employee.categoria,
    shiftType: employee.shiftType,
    shift: employee.shift,
    schedule: schedules.find(schedule => schedule.id === employee.schedule).name,
    holidayDays: employee.holidayDays,
    hireDate: new Date(employee.hireDate).toLocaleDateString(),

}));