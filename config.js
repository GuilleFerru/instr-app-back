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
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_URL_DEV: process.env.MONGO_URL_DEV,
    SECRET_KEY: process.env.SECRET_KEY,
}

