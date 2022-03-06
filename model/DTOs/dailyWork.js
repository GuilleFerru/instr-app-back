import { formatDate } from '../../utils/formatDate.js';

export const saveDailyWorkDTO = (data, dateLocal) => ({
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: data.timeSchedule,
    manteinance: data.manteinance,
    ot: data.ot,
    action: data.action,
    description: data.description,
    complete: data.complete === false ? 'P' : data.complete ,
    beginDate: data.beginDate ? formatDate(data.beginDate) : dateLocal,
    endDate: data.complete === 'C' ? formatDate(new Date()) : '',
    routineScheduleId: data._id ? data._id : '',
    sector: 'Instrumentos-Sistemas'
});

export const updateDayWorkDTO = (dayWorks) => {
    const { tableData, ...scheduleRest } = dayWorks;
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
    action: dayWorks.action,
    description: dayWorks.description === undefined ? '' : dayWorks.description,
    complete: dayWorks.complete,
    beginDate: dayWorks.beginDate,
    endDate: dayWorks.complete === 'C' ? today : '',
    routineScheduleId: dayWorks.routineScheduleId === undefined ? '' : dayWorks.routineScheduleId,
    sector: 'Instrumentos-Sistemas'
})