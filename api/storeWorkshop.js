import { dao } from '../server.js';
import { loggerError } from '../utils/logger.js';
import { changeIDForViewStoreWorkshopDTO, saveStoreWorkshopDTO } from '../model/DTOs/store.js';

export class ApiStoreWorkshop {

    handleSocket = async (...data) => {
        try {
            const { socket, action, storeWorkshopData, io } = data[0];
            if (action === 'get_store_workshop') {
                const data = await this.getStoreWorkshop();
                socket.emit('get_store_workshop', data);
            } else if (action === 'create_store_workshop') {
                const data = await this.createStoreWorkshop(storeWorkshopData);
                data && socket.emit('get_store_workshop', await this.getStoreWorkshop());
            } else if (action === 'update_store_workshop') {
                const data = await this.updateStoreWorkshop(storeWorkshopData);
                data && socket.emit('get_store_workshop', await this.getStoreWorkshop());
            } else if (action === 'delete_store_workshop') {
                const data = await this.deleteStoreWorkshop(storeWorkshopData);
                data && socket.emit('get_store_workshop', await this.getStoreWorkshop());
            }
        } catch (error) {
            loggerError.error(error);
        }
    }


    getStoreWorkshop = async () => {
        try {
            const resp = await dao.getStoreWorkshop();
            const storeWorkshopResp = [];
            resp.map((resp) => storeWorkshopResp.push(changeIDForViewStoreWorkshopDTO(resp)));
            return storeWorkshopResp;
        } catch (error) {
            loggerError.error(error);
        }
    }

    createStoreWorkshop = async (data) => {
        try {
            const dataToSave = saveStoreWorkshopDTO(data);
            const resp = await dao.createWorkshopStoreItem(dataToSave);
            return resp;
        } catch (error) {
            loggerError.error(error);
        }
    }

    updateStoreWorkshop = async (data) => {
        try {
            const { id } = data;
            const dataToUpdate = saveStoreWorkshopDTO(data);
            await dao.updateStoreWorkshop(id, dataToUpdate);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

    deleteStoreWorkshop = async (data) => {
        try {
            const { id } = data;
            await dao.deleteStoreWorkshop(id);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

}