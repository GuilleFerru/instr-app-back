import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { loggerError, loggerInfo } from '../utils/logger.js'


export class ApiManteinance {

    createManteinance = async (manteinance) => {
        try {
            const mantResp = await dao.createManteinance(manteinance);
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
