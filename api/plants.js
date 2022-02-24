import { dao } from '../server.js';


export class ApiPlant {

    createPlant = async (id, plant) => {
        try {
            const newPlant = {
                id: id,
                name: plant
            }
            const plantResp = await dao.createPlant(newPlant);
            return plantResp;
        } catch (err) {
            console.log(err);
            return err;
        } finally {
            console.log('createPlant');
        }
    }

    getPlants = async () => {
        try {
            const plants = await dao.getPlants();
            return plants;
        } catch (err) {
            console.log(err);
            return err;
        } finally {
            console.log('getPlants');
        }
    }
}
