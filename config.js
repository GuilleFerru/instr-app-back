import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`),
});


export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_TLS_REJECT: process.env.NODE_TLS_REJECT_UNAUTHORIZED || '0',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3001,
    MONGO_URL: 'mongodb+srv://instrpr3:t03fnx3x5piHl20P@instrumentosdb.hwfi6.mongodb.net/instrumentos?retryWrites=true&w=majority',
    MONGO_URL_DEV: 'mongodb://localhost:27017',
    SECRET_KEY: 'instrumentos'
}

