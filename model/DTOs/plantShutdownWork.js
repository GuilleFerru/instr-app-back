
import { formatDate, dateInLocalDate } from '../../utils/formatDate.js';

export const changeIDForViewDTO = (data) => ({
    id: data._id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    workToDo: data.workToDo,
    description: data.description,
    complete: data.complete,
    beginDate: data.beginDate,
    endDate: data.endDate,
    routineScheduleId: data.routineScheduleId,
    plantShutdownId: data.plantShutdownId,
    sector: data.sector
});


export const normalizeIDViewDTO = (data) => ({
    _id: data.id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    workToDo: data.workToDo,
    description: data.description,
    complete: data.complete,
    beginDate: data.beginDate,
    endDate: data.endDate,
    routineScheduleId: data.routineScheduleId,
    plantShutdownId: data.plantShutdownId,
    sector: data.sector
});

export const savePlantShutdownWorkDTO = (data, beginDate, endDate, timeSchedule) => ({
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: timeSchedule ? timeSchedule : data.timeSchedule,
    manteinance: 5,
    ot: data.ot,
    action: data.action,
    workToDo: data.workToDo.normalize('NFC'),
    description: data.description.normalize('NFC') === '' ? '' : data.description.normalize('NFC'),
    complete: data.complete === 'PP' ? 'P' : data.complete,
    beginDate: beginDate,
    endDate: endDate ? endDate : '',
    routineScheduleId: data.routineScheduleId ? data.routineScheduleId : "",
    plantShutdownId: data.plantShutdownId ? data.plantShutdownId : null,
    sector: 'Instrumentos-Sistemas'
});

export const plantShutdownWorksRespDTO = (plantShutdowns, columns, actions, dayWorksColumns) => {
    const plantShutdownResp = { plantShutdowns, columns, actions, dayWorksColumns };
    return plantShutdownResp;
}

// si me viene data.id es desde el update, sino desde el create
export const saveDailyWorkFromShutdownWorkDTO = (data) => ({
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description.normalize('NFC'),
    complete: data.complete,
    beginDate: formatDate(data.beginDate),
    beginDateTime: dateInLocalDate(data.beginDate),
    endDate: data.complete === 'C' ? formatDate(new Date()) : '',
    endDateTime: data.complete === 'C' ? dateInLocalDate(new Date()) : null,
    routineScheduleId: data.routineScheduleId,
    plantShutdownWorkId: data.id ? data.id : data.plantShutdownWorkId,
    sector: data.sector
})
