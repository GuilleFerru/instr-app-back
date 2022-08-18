export const holidayScoreRespDTO = (employeeOptions, periodOptions, periodData) => {
    const holidayScoreResp = { employeeOptions, periodOptions, periodData };
    return holidayScoreResp;
}

export const holidayPeriodRespDTO = (periodData) => {
    const holidayPeriodRespDTO = { periodData };
    return holidayPeriodRespDTO;
}

export const saveHolidaysDTO = (name, startDate, endDate, scores) => ({
    periodName: name,
    startDate: startDate,
    endDate: endDate,
    holidaysData: [],
    scores: scores,
    sector: 'Instrumentos-Sistemas'
});


export const holidayDataDTO = (empHolidayData, pointsData, fraction, actualDays, leftDays) => ([
    {
        employee: empHolidayData.employee,
        employeeName: empHolidayData.employeeName,
        periodId: empHolidayData.periodId,
        startDate: new Date(empHolidayData.startDate),
        endDate: new Date(empHolidayData.endDate),
        points: pointsData.points,
        qtyDays: pointsData.qtyDays,
        daysDistribution: pointsData.daysDistribution,
        fraction: fraction,
        actualDays: actualDays,
        leftDays: leftDays,
        createSchedule: empHolidayData.createSchedule
    }
]);