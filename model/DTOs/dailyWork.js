import { formatDate, dateInLocalDateString, parseStringToDate } from '../../utils/formatDate.js';

export const saveDailyWorkDTO = (data, dateLocal) => ({
    id: data._id,
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description,
    complete: data.complete === false ? 'P' : data.complete,
    beginDate: data.beginDate ? formatDate(data.beginDate) : dateLocal,
    endDate: data.complete === 'C' ? formatDate(new Date()) : '',
    routineScheduleId: data._id ? data._id : '',
    plantShutdownId: data.complete === 'PP' ? '1' : data.plantShutdownId ? data.plantShutdownId : null,
    //plantShutdownWorkId: data.plantShutdownWorkId ? data.plantShutdownWorkId : null,
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
    endDate: data.endDate,
    routineScheduleId: data.routineScheduleId,
    plantShutdownId: data.plantShutdownId,
    sector: data.sector
});



export const updateDayWorkDTO = (dayWorks) => {
    const { tableData, beginDateToShow, endDateToShow, ...scheduleRest } = dayWorks;
    return scheduleRest;
}

export const completedDailyWorkDTO = (dayWorks, today) => ({
    _id: dayWorks.id,
    plant: dayWorks.plant,
    attelier: dayWorks.attelier,
    tag: dayWorks.tag ? dayWorks.tag : '',
    timeSchedule: dayWorks.timeSchedule,
    manteinance: dayWorks.manteinance,
    ot: dayWorks.ot === undefined ? '' : dayWorks.ot,
    action: dayWorks.action ? dayWorks.action : 1,
    description: dayWorks.description === undefined ? '' : dayWorks.description,
    complete: dayWorks.complete,
    beginDate: dayWorks.beginDate,
    //endDate: dayWorks.endDate ? dayWorks.endDate : dayWorks.complete === 'C' ? today : '',
    endDate: dayWorks.endDate && dayWorks.complete === 'C' ? dayWorks.endDate : dayWorks.complete === 'C' ? today : '',
    routineScheduleId: dayWorks.routineScheduleId === undefined ? '' : dayWorks.routineScheduleId,
    plantShutdownId: dayWorks.complete === 'PP' ? '1' : null,
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
    description: dailyWorkRoutine.description,
    complete: dailyWorkRoutine.complete,
    beginDate: dailyWorkRoutine.beginDate,
    beginDateToShow: dailyWorkRoutine.beginDate ? dateInLocalDateString(parseStringToDate(dailyWorkRoutine.beginDate)) : '',
    endDate: dailyWorkRoutine.endDate,
    endDateToShow: dailyWorkRoutine.endDate ? dateInLocalDateString(parseStringToDate(dailyWorkRoutine.endDate)) : '',
    routineScheduleId: dailyWorkRoutine.routineScheduleId,
    sector: 'Instrumentos-Sistemas'
})