import { DBMongoDao } from "./DBMongoDao.js";
let instance = null;

class DaoFactory {

    static getInstance() {
        if (!instance) {
            instance = new DaoFactory();
        }
        return instance;
    }
    get(tipo) {
        switch (tipo) {
            case 'mongo':
                return new DBMongoDao();
            default:
                return null;
        }
    }
}

export default DaoFactory;