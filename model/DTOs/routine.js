import { checkWeekDay, formatDate, dateInLocalDate } from '../../utils/formatDate.js';

export const saveRoutineDTO = (plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description, active = true) => ({
    plant: plant,
    attelier: attelier,
    tag: tag,
    timeSchedule: timeSchedule,
    frecuency: frecuency,
    manteinance: manteinance,
    action: action,
    description: description,
    sector: 'Instrumentos-Sistemas',
    active: active
});

export const routineScheduleDTO = (routine, startDate, ot, dueDate, checkDays, otherCheckDay, realCheckedDay, isExpired, complete, filePath, nickname) => ({
    routine: routine,
    startDate: startDate,
    ot: ot,
    dueDate: dueDate,
    checkDays: checkDays,
    otherCheckDay: otherCheckDay ? new Date(otherCheckDay) : null,
    realCheckedDay: realCheckedDay ? new Date(realCheckedDay) : null,
    isExpired: isExpired,
    complete: complete,
    filePath: filePath ? filePath : '',
    nickname: nickname ? nickname : '',
    sector: 'Instrumentos-Sistemas'
});


export const routineRespDTO = (routine, complete, _id, ot) => ({
    _id: _id,
    routineId: routine._id,
    plant: routine.plant,
    attelier: routine.attelier,
    tag: routine.tag,
    timeSchedule: routine.timeSchedule,
    ot: ot ? ot : '',
    frecuency: routine.frecuency,
    manteinance: routine.manteinance,
    action: routine.action,
    description: routine.description,
    complete: complete
});


export const routineRespForOthersRoutineDTO = (routine, complete, _id, ot, filePath, nickname, checkDay, weekCheckDays, realCheckedDay) => ({
    id: _id,
    routineId: routine._id,
    plant: routine.plant,
    attelier: routine.attelier,
    tag: routine.tag,
    ot: ot ? ot : '',
    frecuency: routine.frecuency,
    checkDay: realCheckedDay ? realCheckedDay : checkDay ? checkDay : checkWeekDay(weekCheckDays),
    description: routine.description,
    complete: complete === false ? 'P' : 'C',
    filePath: filePath ? filePath : '',
    nickname: nickname ? nickname : '',
});


export const routineSavedAsDailyWorkDTO = (routine, routineSchedule) => ({
    plant: routine.plant,
    attelier: routine.attelier,
    tag: routine.tag,
    timeSchedule: routine.timeSchedule,
    manteinance: routine.manteinance,
    ot: routineSchedule.ot,
    action: routine.action,
    description: routine.description,
    complete: routineSchedule.complete,
    beginDate: formatDate(new Date()),
    beginDateTime: dateInLocalDate(new Date()),
    endDate: formatDate(new Date()),
    endDateTime: dateInLocalDate(new Date()),
    routineScheduleId: routineSchedule.id,
    sector: "Instrumentos-Sistemas"
})