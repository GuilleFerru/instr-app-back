import { dao } from '../server.js';
import { changeIDForViewItemsDTO } from '../model/DTOs/store.js';

export class ApiStoreItem {

    uploadStoreItems = async (data) => {
        try {
            await dao.uploadStoreItems(data);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

    getStoreItemBy = async (value) => {
        try {
            const itemsResp = []
            const items = await dao.getStoreItemBy(value);
            items.map((item) => { itemsResp.push(changeIDForViewItemsDTO(item)) });
            return itemsResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }
}