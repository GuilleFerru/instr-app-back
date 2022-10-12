import { ApiStoreItem } from '../api/storesItems.js';

export class ControllerStore {

    constructor() {
        this.apiStoreItem = new ApiStoreItem();
    }

    uploadStoreItems = async (req, res) => {
        try {
            const storeItemsResp = await this.apiStoreItem.uploadStoreItems(req.body);
            res.status(200).json(storeItemsResp);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    getStoreItemBy = async (req, res) => {
        try {
            const { value } = req.params;
            const storeItemsResp = await this.apiStoreItem.getStoreItemBy(value);
            return res.status(200).json(storeItemsResp);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
