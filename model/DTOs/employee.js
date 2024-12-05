import { formatDate, dateInLocalDateString, parseStringToDate, parseStringToString } from '../../utils/formatDate.js';

export const employeeDTO = (employee) => ({
    legajo: employee.legajo,
    nombre: employee.nombre,
    apellido: employee.apellido,
    puesto: employee.puesto,
    categoria: employee.categoria,
    shift: employee.turno,
    schedule: employee.turno,
    sector: "Instrumentos-Sistemas",
    condicion: "Afiliado",
    shiftType: employee.shift,
    holidayDays: employee.holidayDays,
    hireDate: employee.hireDate,
    status: employee.status,
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
    hireDate: new Date(employee.hireDate).toLocaleDateString("es-AR"),
    status: employee.status,
}));

export const updateEmployeeDTO = (employee, employeeDb) => ({
    legajo: employee.legajo,
    nombre: employee.nombre,
    apellido: employee.apellido,
    puesto: employee.puesto,
    categoria: employee.categoria,
    condicion: employee.condicion,
    shiftType: employee.shift,
    shift: employee.turno,
    schedule: employee.shift === 'dailyShift' ? employee.turno : employeeDb[0].schedule,
    holidayDays: employee.holidayDays,
    hireDate: new Date(employee.hireDate),
    status: employee.status,
});

export const filterActiveEmployeesDTO = (employees) => {
    const activeEmployees = employees.filter(employee => employee.status === true);
    return activeEmployees;
}
