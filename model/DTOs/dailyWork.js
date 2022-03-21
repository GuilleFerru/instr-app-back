import { formatDate, dateInLocalDateString, parseStringToDate } from '../../utils/formatDate.js';

export const saveDailyWorkDTO = (data, dateLocal) => ({
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
    sector: 'Instrumentos-Sistemas'
});

export const updateDayWorkDTO = (dayWorks) => {
    const { tableData, beginDateToShow, endDateToShow, ...scheduleRest } = dayWorks;
    return scheduleRest;
}

export const completedDailyWorkDTO = (dayWorks, today) => ({
    _id: dayWorks._id,
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
    endDate: dayWorks.endDate ? dayWorks.endDate : dayWorks.complete === 'C' ? today : '',
    routineScheduleId: dayWorks.routineScheduleId === undefined ? '' : dayWorks.routineScheduleId,
    sector: 'Instrumentos-Sistemas'
})

export const dailyWorkRoutineRespDTO = (dailyWorkRoutine) => ({
    _id: dailyWorkRoutine._id,
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