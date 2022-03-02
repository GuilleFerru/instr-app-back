import express, { json } from 'express';
import { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import DaoFactory from './model/DAOs/DaoFactory.js';
import cors from 'cors';
import * as router from './utils/routersInstances.js';
import { loggerError, loggerInfo, loggerWarn } from "./utils/logger.js";


const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
    loggerInfo.info(`Servidor listo en el puerto ${port}`);
});

app.on("error", (error) => {
    loggerError.error(error);
});

config();

app.use(json());
app.use(express.urlencoded({ extended: true }));


const daoInstance = DaoFactory.getInstance();
export const dao = daoInstance.get('mongo');



//middleware
app.use(json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

// endpoints
app.use('/api/shift', router.routerShift.start());
app.use('/api/emp', router.routerEmployee.start());
app.use('/api/schedule', router.routerSchedule.start());
app.use('/api/timeSchedule', router.routerTimeSchedule.start());
app.use('/api/aditional', router.routerAditional.start());
app.use('/api/plant', router.routerPlant.start());
app.use('/api/dailyWork', router.routerDailyWork.start());
app.use('/api/attelier', router.routerAttelier.start());
app.use('/api/tag', router.routerTag.start());
app.use('/api/routine', router.routerRoutine.start());
app.use('/api/manteinance', router.routerManteinance.start());
app.use('/api/manteinanceAction', router.routerManteinanceAction.start());

app.get('/', (req, res) => {
    res.send('Home Page')
})





// const io = new SocketIO.Server(server)
// const empDailyScheduleData = [];


// /* Socket para datos de personal */

// io.on('connection', socket => {
//     socket.emit('empDailyScheduleData', empDailyScheduleData);
// });



// /*  LECTURA DEL ARCHIVO DEL PERONAL POR DIA    */


// const readEmpDailySchedule = () => {
//     fs.readFile('empDailySchedule.txt', "UTF-8", (error, content) => {
//         if (error) {
//             console.error("Hubo un error con fs.readFile!");
//         } else {
//             const contentJSON = JSON.parse(content);
//             contentJSON.forEach(empDailyData => {
//                 empDailyScheduleData.push(empDailyData)
//             });
//         }
//     })
// }


