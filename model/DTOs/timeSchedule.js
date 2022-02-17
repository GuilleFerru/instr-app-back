export const timeScheduleDTO = (timeSchedule) => (
    timeSchedule[0].timeSchedule
);

export const timeScheduleForScheduleDTO = (timeSchedule) => timeSchedule.map(timeSchedule => ({
    id: timeSchedule.id,
    name: timeSchedule.name
}));