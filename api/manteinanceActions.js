import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { loggerError, loggerInfo } from '../utils/logger.js'


export class ApiManteinanceAction {

    createManteinanceAction = async (action) => {
        try {
            const mantResp = await dao.createManteinanceAction(action);

            await ApiDailyWorksColumnTable.deleteColumns(await ApiDailyWorksColumnTable.getColumnsId())
            await ApiDailyWorksColumnTable.createColumns();

            return mantResp;
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
            loggerInfo.info('createManteinanceAction');
        }
    }

    static getManteinanceActionsForColumnTable = async () => {
        try {
            const mantActResp = await dao.getManteinanceActions();
            return reduceForLookUp(mantActResp);
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
        }
    }
}
