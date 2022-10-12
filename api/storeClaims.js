import { dao } from '../server.js';
import { saveStoreClaimDTO, changeIDForViewDTO } from '../model/DTOs/store.js';
import { loggerError } from '../utils/logger.js';


export class ApiStoreClaim {


    handleSocket = async (...data) => {
        try {
            const { date, socket, action, storeClaimData, io } = data[0];
            if (action === 'get_store_claims') {
                const data = await this.getStoreClaims();
                socket.emit('get_store_claims', data);
            } else if (action === 'create_store_claim') {
                const data = await this.createStoreClaim(storeClaimData);
                data && socket.emit('get_store_claims', await this.getStoreClaims());
            } else if (action === 'update_store_claim') {
                const data = await this.updateStoreClaim(storeClaimData);
                data && socket.emit('get_store_claims', await this.getStoreClaims());
            } else if (action === 'bulk_update_store_claims') {
                for (let i = 0; i < storeClaimData.length; i++) {
                    await this.updateStoreClaim(storeClaimData[i]);
                }
                socket.emit('get_store_claims', await this.getStoreClaims());
                //storeClaimData.forEach(async (claim) => await this.updateStoreClaim(claim));
                //socket.emit('get_store_claims', await this.getStoreClaims());
            } else if (action === 'delete_store_claim') {
                const data = await this.deleteStoreClaim(storeClaimData);
                data && socket.emit('get_store_claims', await this.getStoreClaims());
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    getStoreClaims = async () => {
        try {
            const claimsResp = [];
            const claims = await dao.getStoreClaims();
            claims.map((claim) => claimsResp.push(changeIDForViewDTO(claim)));
            return claimsResp;
        } catch (error) {
            loggerError.error(error);
        }
    }

    createStoreClaim = async (data) => {
        try {
            const dataToSave = saveStoreClaimDTO(data)
            await dao.createStoreClaim(dataToSave);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

    updateStoreClaim = async (data) => {
        try {
            const { id, ...rest } = data;
            const dataToSave = saveStoreClaimDTO(rest)
            await dao.updateStoreClaim(id, dataToSave);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

    // bulkUpdateStoreClaim = async (data) => {
    //     try {
    //         const bulkResp = data.map(async (claim) => {
    //             await this.updateStoreClaim(claim);
    //         })
    //         console.log(bulkResp)
    //         return true;
    //     } catch (error) {
    //         loggerError.error(error);
    //     }
    //}


    deleteStoreClaim = async (data) => {
        try {
            const { id } = data;
            await dao.deleteStoreClaim(id);
            return true;
        } catch (error) {
            loggerError.error(error);
        }
    }

}