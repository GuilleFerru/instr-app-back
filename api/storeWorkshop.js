import { dao } from '../server.js';
import { loggerError } from '../utils/logger.js';
import { changeIDForViewStoreWorkshopDTO, saveStoreWorkshopDTO, reduceForLookUpDTO, saveUbicationWorkshopDTO } from '../model/DTOs/store.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';

export class ApiStoreWorkshop {

    handleSocket = async (...data) => {
        try {
            const { socket, action, storeWorkshopData, io } = data[0];

            const actionsMap = {
                'get_store_workshop': async () => {
                    const data = await this.getStoreWorkshop();
                    socket.emit('get_store_workshop', data);
                },
                'create_store_workshop': async () => {
                    const data = await this.createStoreWorkshop(storeWorkshopData);
                    if (data) socket.emit('get_store_workshop', await this.getStoreWorkshop());
                },
                'create_crud_workshop': async () => {
                    const data = await this.createCrudWorkshop(storeWorkshopData);
                    if (data) socket.emit('get_store_workshop', await this.getStoreWorkshop());
                },
                'update_store_workshop': async () => {
                    const data = await this.updateStoreWorkshop(storeWorkshopData);
                    if (data) socket.emit('get_store_workshop', await this.getStoreWorkshop());
                },
                'update_crud_workshop': async () => {
                    const data = await this.updateCrudWorkshop(storeWorkshopData);
                    socket.emit('get_store_workshop', data ? await this.getStoreWorkshop() : false);
                },
                'delete_store_workshop': async () => {
                    const data = await this.deleteStoreWorkshop(storeWorkshopData);
                    if (data) socket.emit('get_store_workshop', await this.getStoreWorkshop());
                },
                'delete_crud_workshop': async () => {
                    const data = await this.deleteCrudWorkshop(storeWorkshopData);
                    if (data) socket.emit('get_store_workshop', await this.getStoreWorkshop());
                }
            };
            if (actionsMap[action]) {
                await actionsMap[action]();
            } else {
                loggerError.error(`Unknown action: ${action}`);
            }
        } catch (error) {
            loggerError.error(error)
        }
    }

    getStoreWorkshop = async () => {
        try {
            const [resp, types, ubications] = await Promise.all([
                dao.getStoreWorkshop(),
                dao.getStoreWorkshopTypes(),
                dao.getStoreWorkshopUbications()
            ]);
            const typesReducedForLookUp = reduceForLookUpDTO(types);
            const ubicationsReducedForLookUp = reduceForLookUpDTO(ubications);
            const typesReduced = reduceForLookUp(typesReducedForLookUp);
            const ubicationsReduced = reduceForLookUp(ubicationsReducedForLookUp);
            const storeWorkshopResp = resp.map((resp) => changeIDForViewStoreWorkshopDTO(resp));
            return { storeWorkshopResp, typesReduced, ubicationsReduced };
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

    createCrudWorkshop = async (data) => {
        try {
            const { name, crudAction } = { ...data };
            const actionMap = {
                'eqType': () => dao.createTypeWorkshop(name),
                'ubication': () => dao.createUbicationWorkshop(name)
            }
            if (actionMap[crudAction]) {
                await actionMap[crudAction]();
                return true;
            } else {
                loggerError.error(`Unknown action: ${crudAction}`);
            }
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

    updateCrudWorkshop = async (data) => {
        try {
            const { id, name, crudAction } = { ...data };
            if (data) {
                const resp = await dao.updateCrudWorkshop(id, name, crudAction);
                return resp;
            } else {
                loggerError.error(`Unknown action: ${crudAction}`);
            }
        } catch (error) {
            loggerError.error(error);
        }
    }

    deleteCrudWorkshop = async (data) => {
        try {
            const { id, crudAction } = { ...data };
            if (data) {
                await dao.deleteCrudWorkshop(id, crudAction);
                return true;
            } else {
                loggerError.error(`Unknown action: ${crudAction}`);
            }
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