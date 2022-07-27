export const holidayScoreRespDTO = (employeeOptions, periodOptions,  periodData) => {
    const holidayScoreResp = { employeeOptions, periodOptions, periodData };
    return holidayScoreResp;
}

export const saveHolidaysDTO = (name, startDate, endDate) => ({
    periodName: name,
    startDate: startDate,
    endDate: endDate,
    holidaysData: [],
    sector: 'Instrumentos-Sistemas'
});