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
    complete: data.complete === false ? 'P' : 'C',
    beginDate: data.beginDate ? formatDate(data.beginDate) : dateLocal,
    endDate: data.complete === 'C' ? formatDate(new Date()) : '',
    routineScheduleId: data._id ? data._id : '',
    sector: 'Instrumentos-Sistemas'
});

export const updateDayWorkDTO = (dayWorks) => {
    const { tableData, ...scheduleRest } = dayWorks;
    return scheduleRest;
}