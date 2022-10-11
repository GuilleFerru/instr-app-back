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
f
            return res.status(500).json(err);
        }
    }
}
