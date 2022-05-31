

export const savePlantShutdownWorkDTO = (data, beginDate, endDate, timeSchedule) => ({
    plant: data.plant,
    attelier: data.attelier,
    tag: data.tag,
    timeSchedule: timeSchedule,
    manteinance: 5,
    ot: data.ot,
    action: data.action,
    workToDo: data.workToDo,
    description: data.description === '' ? '' : data.description,
    complete: data.complete === 'PP' ? 'P' : data.complete,
    beginDate: beginDate,
    endDate: endDate ? endDate : '',
    routineScheduleId: data.routineScheduleId ? data.routineScheduleId : "",
    plantShutdownId: data.plantShutdownId ? data.plantShutdownId : null,
    dailyWorkId: data.id ? data.id : [],
    sector: 'Instrumentos-Sistemas'
});

export const plantShutdownWorksRespDTO = (plantShutdowns, columns) => {
    const plantShutdownResp = { plantShutdowns, columns };
    return plantShutdownResp;
}

export const removePlantShutdownWorkIdDTO = (plantShutdownWork) => {
    const { _id, ...plantShutdownWorkRest } = plantShutdownWork;
    return plantShutdownWorkRest;
}