import { dateInLocalDate } from '../../utils/formatDate.js';

export const scheduleUpdateDTO = (newEmployee, employeeDb) => ({
    legajo: newEmployee.legajo,
    date: dateInLocalDate(new Date()),
    fromSchedule:
        [
            {
                shiftType: employeeDb.shiftType,
                shift: employeeDb.shift,
            }
        ],
    toSchedule:
        [
            {
                shiftType: newEmployee.shiftType,
                shift: newEmployee.shift,
            }
        ],
    sector: "Instrumentos-Sistemas"
});


