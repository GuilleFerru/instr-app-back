import { dao } from '../server.js';
import { reduceForLookUp } from '../utils/reduceForLookup.js';
import { ApiDailyWorksColumnTable } from '../utils/dailyWorksColumnTable.js';
import { loggerError, loggerInfo } from '../utils/logger.js'

export class ApiAttelier {

    createAttelier = async (attelier) => {
        try {
            const attelierResp = await dao.createAttelier(attelier);

            await ApiDailyWorksColumnTable.deleteColumns(await ApiDailyWorksColumnTable.getColumnsId())
            await ApiDailyWorksColumnTable.createColumns();

            return attelierResp;
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerInfo.info('createAttelier');
        }
    }

    getAttelieres = async () => {
        try {
            const attelieres = await dao.getAttelieres();
            return attelieres;
            
            // const attelieres = await dao.getAttelieresGroupByPlant();
            // let countPlant = 1000;
            // const arrayToReduce = [];

            // attelieres.map((attelier) => {
            //     arrayToReduce.push({
            //         id: countPlant,
            //         name: attelier._id,
            //     })
            //     countPlant++;
            //     attelier.atteliers.map((attelier) => {
            //         arrayToReduce.push({
            //             id: attelier.id,
            //             name: attelier.name,
            //         })
            //     })

            // })
            // let objToReturn = {}
            // return arrayToReduce.reduce((acc, curr, index) => {
            //     // acc[curr.id] = curr.name;
            //     console.log(acc[curr.id])
            //     // acc[curr.id] = curr.name;
            //     return acc;
            // }, {});

        } catch (err) {
            console.log(err)
            loggerError.error(err);
        } finally {
        }
    }

    static getAttelieresForColumnTable = async () => {
        try {
            const attelieres = await dao.getAttelieres();
            return reduceForLookUp(attelieres);
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }


    getAtteliresByPlant = async (plantName) => {
        try {
            const attelieres = await dao.getAtteliersByPlant(plantName);
            return attelieres;
        } catch (err) {
            loggerError.error(err);
        } finally {
        }
    }

}