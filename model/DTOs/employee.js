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
