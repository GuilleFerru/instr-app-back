import { dao } from '../server.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiTag {

    createTag = async (tag) => {
        try {
            const tagResp = await dao.createTag(tag);
            return tagResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createTag');
        }
    }

    getTag = async (tag) => {
        try {
            const tagResp = await dao.getTag(tag);
            return tagResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}