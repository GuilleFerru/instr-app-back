import { formatDate, dateInLocalDateString, parseStringToDate, dateInLocalDate } from '../../utils/formatDate.js';

export const saveDailyWorkDTO = (data, dateLocal, isWeekend = false) => ({
    id: data._id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: isWeekend ? 1 : data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description.normalize('NFC'),
    complete: data.complete === false ? 'P' : data.complete,
    beginDate: data.beginDate ? formatDate(data.beginDate) : dateLocal,
    beginDateTime: data.beginDate ? dateInLocalDate(data.beginDate) : parseStringToDate(dateLocal),
    endDate: data.complete === 'C' ? formatDate(new Date()) : '',
    endDateTime: data.complete === 'C' ? dateInLocalDate(new Date()) : null,
    routineScheduleId: data._id ? data._id : '',
    plantShutdownWorkId: data.complete === 'PP' ? '1' : data.plantShutdownWorkId ? data.plantShutdownWorkId : null,
    sector: 'Instrumentos-Sistemas'
});


export const changeIDForViewDTO = (data) => ({
    id: data._id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description,
    complete: data.complete,
    beginDate: data.beginDate,
    beginDateTime: data.beginDateTime,
    endDate: data.endDate,
    endDateTime: data.endDateTime,
    routineScheduleId: data.routineScheduleId,
    plantShutdownWorkId: data.plantShutdownWorkId,
    sector: data.sector
});


export const changeViewForPlantShutdonWorksToDoDTO = (data) => ({
    id: data._id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description,
    complete: data.complete,
    beginDate: data.beginDate,
    endDate: data.endDate,
    routineScheduleId: data.routineScheduleId,
    plantShutdownId: data.plantShutdownWorkId,
    sector: data.sector
});



export const updateDayWorkDTO = (dayWorks) => {
    const { tableData, beginDateToShow, endDateToShow, ...scheduleRest } = dayWorks;
    return scheduleRest;
}

export const completedDailyWorkDTO = (dayWorks, today, fromPlantShutdownWork = false) => ({
    _id: dayWorks.id,
    plant: dayWorks.plant,
    attelier: dayWorks.attelier,
    tag: dayWorks.tag ? dayWorks.tag : '',
    timeSchedule: dayWorks.timeSchedule,
    manteinance: dayWorks.manteinance,
    ot: dayWorks.ot === undefined ? '' : dayWorks.ot,
    action: dayWorks.action ? dayWorks.action : 1,
    description: dayWorks.description === undefined ? '' : dayWorks.description.normalize('NFC'),
    complete: dayWorks.complete,
    beginDate: formatDate(dayWorks.beginDateTime) === dayWorks.beginDate ? dayWorks.beginDate : formatDate(dayWorks.beginDateTime),
    //beginDate: dayWorks.beginDate,
    beginDateTime: dayWorks.beginDateTime,
    endDate: dayWorks.endDate && dayWorks.complete === 'C' ? new Date(dayWorks.endDateTime) < new Date(dayWorks.beginDateTime) ? formatDate(dayWorks.beginDateTime) : dayWorks.endDate : dayWorks.complete === 'C' ? today : '',
    endDateTime: dayWorks.endDateTime && dayWorks.complete === 'C' ? new Date(dayWorks.endDateTime) < new Date(dayWorks.beginDateTime) ? dayWorks.beginDateTime : dayWorks.endDateTime : dayWorks.complete === 'C' ? dateInLocalDate(new Date()) : null,
    routineScheduleId: dayWorks.routineScheduleId === undefined ? '' : dayWorks.routineScheduleId,
    plantShutdownWorkId: fromPlantShutdownWork ? dayWorks.plantShutdownWorkId : dayWorks.complete === 'PP' ? '1' : null,
    sector: 'Instrumentos-Sistemas'
})

export const dailyWorkRoutineRespDTO = (dailyWorkRoutine) => ({
    id: dailyWorkRoutine._id,
    plant: dailyWorkRoutine.plant,
    attelier: dailyWorkRoutine.attelier,
    tag: dailyWorkRoutine.tag,
    timeSchedule: dailyWorkRoutine.timeSchedule,
    manteinance: dailyWorkRoutine.manteinance,
    ot: dailyWorkRoutine.ot,
    action: dailyWorkRoutine.action,
    description: dailyWorkRoutine.description.normalize('NFC'),
    complete: dailyWorkRoutine.complete,
    beginDate: dailyWorkRoutine.beginDate,
    beginDateToShow: dailyWorkRoutine.beginDate ? dateInLocalDateString(parseStringToDate(dailyWorkRoutine.beginDate)) : '',
    endDate: dailyWorkRoutine.endDate,
    endDateToShow: dailyWorkRoutine.endDate ? dateInLocalDateString(parseStringToDate(dailyWorkRoutine.endDate)) : '',
    routineScheduleId: dailyWorkRoutine.routineScheduleId,
    sector: 'Instrumentos-Sistemas'
})
