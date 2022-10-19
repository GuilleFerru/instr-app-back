import { dao } from '../server.js';
import { changeIDForViewItemsDTO } from '../model/DTOs/store.js';
import { loggerError } from '../utils/logger.js'

export class ApiStoreItem {

    uploadStoreItems = async (data) => {
        try {
            const itemsResp = await dao.uploadStoreItems(data);
            if (itemsResp)
                return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

    getStoreItemBy = async (value) => {
        try {
            const resp = await dao.getStoreItemBy();
            const items = resp ? resp.items : [];
            const date = resp ? resp.date : new Date();
            const regex = new RegExp(value, 'i');
            const findItems = items.filter(item => regex.test(item.item) || regex.test(item.smallDescription) || regex.test(item.bigDescription));
            const itemsResp = findItems.map(item => changeIDForViewItemsDTO(item));
            return { items: itemsResp, date: date };
        } catch (err) {
            console.error(err);
            loggerError.error(err);
        } finally {
        }
    }
}