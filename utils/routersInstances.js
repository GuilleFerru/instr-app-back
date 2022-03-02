import { RouterShift } from "../router/shifts.js";
const routerShift = new RouterShift();
import { RouterEmployee } from "../router/employees.js";
const routerEmployee = new RouterEmployee();
import { RouterSchedule } from "../router/schedules.js";
const routerSchedule = new RouterSchedule();
import { RouterTimeSchedule } from "../router/timeSchedules.js";
const routerTimeSchedule = new RouterTimeSchedule();
import { RouterAditional } from "../router/aditionals.js";
const routerAditional = new RouterAditional();
import {RouterPlant} from "../router/plants.js";
const routerPlant = new RouterPlant();
import {RouterDailyWork} from "../router/dailyWorks.js";
const routerDailyWork = new RouterDailyWork();
import {RouterAttelier} from "../router/attelieres.js";
const routerAttelier = new RouterAttelier();
import {RouterTag} from "../router/tags.js";
const routerTag = new RouterTag();
import {RouterRoutine} from "../router/routines.js";
const routerRoutine = new RouterRoutine();
import {RouterManteinance} from "../router/manteinances.js";
const routerManteinance = new RouterManteinance();
import {RouterManteinanceAction} from "../router/manteinanceActions.js";
const routerManteinanceAction = new RouterManteinanceAction();

export {
    routerShift,
    routerEmployee,
    routerSchedule,
    routerTimeSchedule,
    routerAditional,
    routerPlant,
    routerDailyWork,
    routerAttelier,
    routerTag,
    routerRoutine,
    routerManteinance,
    routerManteinanceAction,
}
