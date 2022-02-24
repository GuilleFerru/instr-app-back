export const scheduleDTO = (employee, currentTimeSchedule, workedHours) => ({
    id: employee._id,
    legajo: employee.legajo,
    fullName: employee.legajo,
    timeSchedule: currentTimeSchedule.id,
    workedHours: workedHours
});

export const returnScheduleDTO = (date, schedule, columns, aditionals) => ({
    date: date,
    schedule: schedule,
    columns: columns,
    aditionals: aditionals,
});


export const saveScheduleDTO = (date, schedule, columns) => ({
    date: date,
    schedule: schedule,
    columns: columns,
    sector: 'Instrumentos-Sistemas'
});

export const updateScheduleDTO = (schedule) => {
    const {tableData, ...scheduleRest} = schedule;
    return scheduleRest;
}
    




// export const updateScheduleDTO = (schedule) => ({
//     id: schedule.id,
//     legajo: Number(schedule.legajo),
//     fullName: Number(schedule.fullName),
//     timeSchedule: Number(schedule.timeSchedule),
//     workedHours: Number(schedule.workedHours),
// });

// export const respScheduleDTO = (schedule, ScheduleEmployees,timeSchedule) => ({
//     schedule: schedule,
//     employees: ScheduleEmployees,
//     timeSchedule: timeSchedule
// });