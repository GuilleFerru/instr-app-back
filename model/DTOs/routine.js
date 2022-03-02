import { formatDate } from '../../utils/formatDate.js';

export const saveRoutineDTO = (plant, attelier, tag, timeSchedule, frecuency, manteinance, action, description) => ({
    plant: plant,
    attelier: attelier,
    tag: tag,
    timeSchedule: timeSchedule,
    frecuency: frecuency,
    manteinance: manteinance,
    action: action,
    description: description,
    sector: 'Instrumentos-Sistemas'
});

export const routineScheduleDTO = (routine, startDate, ot, dueDate, checkDays, otherCheckDay, isExpired, complete) => ({
    routine: routine,
    startDate: startDate,
    ot: ot,
    dueDate: dueDate,
    checkDays: checkDays,
    otherCheckDay: otherCheckDay ? otherCheckDay : '',
    isExpired: isExpired,
    complete: complete,
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