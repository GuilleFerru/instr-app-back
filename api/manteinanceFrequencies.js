import { dao } from '../server.js';
import { loggerInfo } from '../utils/logger.js'


export class ApiManteinanceFrequency {

    static getManteinanceFrequencyForSelectForm = async () => {
        try {
            const mantResp = await dao.getManteinanceFrequencies();
            return mantResp;
        } catch (err) {
            loggerInfo.info(err);
            return err;
        } finally {
        }
    }
}
