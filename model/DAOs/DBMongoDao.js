import mongoose from "mongoose";
import config from "../../config.js";
import {shifts} from "../models/Shifts.js";
import { loggerError, loggerInfo, loggerWarn } from "../../utils/logger.js";

const MONGO_URL = config.MONGO_URL;

export class DBMongoDao {

    constructor() {
        (async () => {
            loggerInfo.info("Contectando a la Base de datos...");
            this.connection = await mongoose.connect(MONGO_URL);
            loggerInfo.info("Base de datos conectada", this.connection.connection.host);
        })();
    }

    createShift = async (turno, shiftsArray) => {
        try {

            const shift = await shifts.insertMany({
                nombre: turno,
                shift: shiftsArray,
            });          
            return shift;
        } catch (error) {
            loggerError.error(error)
        }

    }
}
// module.exports = DBMongoDao;