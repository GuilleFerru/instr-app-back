import { dao } from '../server.js';
import { loggerError } from '../utils/logger.js';
import { changeIDForViewStoreWorkshopDTO, saveStoreWorkshopDTO } from '../model/DTOs/store.js';

export class ApiStoreWorkshop {

    handleSocket = async (...data) => {
        try {
            const { socket, action, storeWorkshopData, io } = data[0];
            if (action === 'get_store_workshop') {
                // const data = [
                //     { 'id': 1, 'type': '1', 'tag': 'FV4604', 'storeCode': '123652156', 'bigDescription': 'SAMSON	1"	S150	HASTELLOY-C4	HASTELLOY-C4	CV 12	ABRE	Tapón y empaquetadura recuperados', 'qty': '1', 'storeUbication': '1' }
                //     , { 'id': 2, 'type': '1', 'tag': 'FV1106', 'storeCode': '124552143', 'bigDescription': 'SAMSON	1"	S150	URANUS 	URANUS	CV 12	ABRE	Buje guia vástago HC soldado', 'qty': '1', 'storeUbication': '2' },
                //     { 'id': 3, 'type': '2', 'tag': 'FT8417', 'storeCode': '13556214', 'bigDescription': 'Caudalimetro masico Yokogawa 3" S300 POWELL', 'qty': '1', 'storeUbication': '6' }
                //     , { 'id': 4, 'type': '3', 'tag': '', 'storeCode': '', 'bigDescription': 'Cage LT4703', 'qty': '1', 'storeUbication': '4' }];
                // 
                const data = await this.getStoreWorkshop();
                socket.emit('get_store_workshop', data);
            } else if (action === 'create_store_workshop') {
                const data = await this.createStoreWorkshop(storeWorkshopData);
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
            const dataToSave = saveStoreWorkshopDTO(data)
            const resp = await dao.createWorkshopStoreItem(dataToSave);
            return resp;
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