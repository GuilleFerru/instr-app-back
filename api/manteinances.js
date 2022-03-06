import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { loggerError, loggerInfo } from '../utils/logger.js'


export class ApiManteinance {

    createManteinance = async (manteinance) => {
        try {
            const mantResp = await dao.createManteinance(manteinance);

            await ApiDailyWorksColumnTable.deleteColumns(await ApiDailyWorksColumnTable.getColumnsId())
            await ApiDailyWorksColumnTable.createColumns();

            return mantResp;
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
            loggerInfo.info('createManteinance');
        }
    }

    static getManteinancesForColumnTable = async () => {
        try {
            const mantResp = await dao.getManteinances();
            return reduceForLookUp(mantResp);
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
        }
    }
}
