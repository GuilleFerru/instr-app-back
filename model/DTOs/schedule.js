export const scheduleDTO = (employee,currentTimeSchedule, workedHours) => ({
    id: employee._id,
    legajo: employee.legajo,
    fullName: employee.legajo,
    timeSchedule: currentTimeSchedule.id,
    workedHours: workedHours
});

export const newScheduleDTO = (date, schedule, timeSchedule, ScheduleEmployees, aditionals) => ({
    date: date,
    schedule: schedule,
    timeSchedule: timeSchedule,
    employeesForSchedule: ScheduleEmployees,
    aditionals: aditionals
});

export const updateScheduleDTO = (schedule) => ({
    id: schedule.id,
    legajo: Number(schedule.legajo),
    fullName: Number(schedule.fullName),
    timeSchedule: Number(schedule.timeSchedule),
    workedHours: Number(schedule.workedHours)
});

// export const respScheduleDTO = (schedule, ScheduleEmployees,timeSchedule) => ({
//     schedule: schedule,
//     employees: ScheduleEmployees,
//     timeSchedule: timeSchedule
// });