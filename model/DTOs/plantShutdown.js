

export const createPlantShutdownDTO = (plantShutdownData) => {
    const { plantShutDownsInitialRowData, ...plantShutdownDataRest } = plantShutdownData;
    return plantShutdownDataRest;
}

export const changeIDForViewDTO = (data) => ({
    id: data._id,
    name: data.name,
    beginDate: data.beginDate,
    endDate: data.endDate,
    description: data.description,
    complete: data.complete,
});


export const plantShutdownRespDTO = (plantShutdowns, columns) => {
    const plantShutdownResp = { plantShutdowns, columns };
    return plantShutdownResp;
}

export const plantShutdownReduceForLookUpDTO = (plantShutdowns) => plantShutdowns.map(plantShutdown => ({
    id: plantShutdown._id,
    name: plantShutdown.name,
}));