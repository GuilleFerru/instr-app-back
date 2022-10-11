import { dao } from '../server.js';


export class ApiStoreItem {


    uploadStoreItems = async (data) => {
        try {
            //console.log(data);
            //const dataToSave = saveStoreItemDTO(data)
            await dao.uploadStoreItems(data);
            return true;
        } catch (error) {
            loggerError.error(error);
        }

    }
}