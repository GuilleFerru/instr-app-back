import { ApiStoreItem } from '../api/storesItems.js';
import { ApiStoreWorkshop } from '../api/storeWorkshop.js';

export class ControllerStore {

    constructor() {
        this.apiStoreItem = new ApiStoreItem();
        this.apiStoreWorkshop = new ApiStoreWorkshop();
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

    // getDataForUbicationCrud = async (_req, res) => {
    //     try {
    //         const ubicationItemsResp = await this.apiStoreWorkshop.getDataForUbicationCrud();
    //         return res.status(200).json(ubicationItemsResp);
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(500).json(err);
    //     }
    // }

    // deleteUbicationWorkshop = async (req, res) => {
    //     try {
    //         const { ubicationId } = req.query;
    //         const ubicationItemsResp = await this.apiStoreWorkshop.deleteUbicationWorkshop(ubicationId);
    //         return res.status(200).json(ubicationItemsResp);
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(500).json(err);
    //     }
    // }
}
