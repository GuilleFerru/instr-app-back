import { ApiPlant } from '../api/plants.js';
import { ApiAttelier } from '../api/attelieres.js';
import { ApiTimeSchedule } from '../api/timeSchedules.js';
import { ApiManteinance } from '../api/manteinances.js';
import { ApiManteinanceAction } from '../api/manteinanceActions.js';
import { ApiPlantShutdown } from '../api/plantShutdowns.js';

const plantData = async () => {
    return await ApiPlant.getPlantsForColumnTable();
}

const attelierData = async () => {
    return await ApiAttelier.getAttelieresForColumnTable();
}

const timeScheduleData = async () => {
    return await ApiTimeSchedule.getTimeScheduleForColumnTable();
}

const manteinanceData = async () => {
    return await ApiManteinance.getManteinancesForColumnTable();
}

const manteinanceActionData = async () => {
    return await ApiManteinanceAction.getManteinanceActionsForColumnTable();
}

const plantShutdownsData = async () => {
    return await ApiPlantShutdown.getPlantShutdownsForColumnTable();
}

export {
    plantData,
    attelierData,
    timeScheduleData,
    manteinanceData,
    manteinanceActionData,
    plantShutdownsData
}



