import express, { json } from 'express';
import { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import DaoFactory from './model/DAOs/DaoFactory.js';
import cors from 'cors'
import { loggerError, loggerInfo, loggerWarn } from "./utils/logger.js";
// import {userRoute} from "./router/users.js.js";
// import {authRoute} from "./router/auth.js.js";
// import {empRoute} from "./router/employees.js";


const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.info(`Servidor listo en el puerto ${port}`);
});

app.on("error", (error) => {
    console.error(error);
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

import { RouterShift } from "./router/shifts.js";
const routerShift = new RouterShift();
import { RouterEmployee } from "./router/employees.js";
const routerEmployee = new RouterEmployee();
import { RouterSchedule } from "./router/schedules.js";
const routerSchedule = new RouterSchedule();
import { RouterTimeSchedule } from "./router/timeSchedules.js";
const routerTimeSchedule = new RouterTimeSchedule();
import { RouterAditional } from "./router/aditionals.js";
const routerAditional = new RouterAditional();
import {RouterPlant} from "./router/plants.js";
const routerPlant = new RouterPlant();
import {RouterDailyWork} from "./router/dailyWorks.js";
const routerDailyWork = new RouterDailyWork();


// app.use('/api/user', userRoute)
// app.use('/api/auth', authRoute)
app.use('/api/shift', routerShift.start());
app.use('/api/emp', routerEmployee.start());
app.use('/api/schedule', routerSchedule.start());
app.use('/api/timeSchedule', routerTimeSchedule.start());
app.use('/api/aditional', routerAditional.start());
app.use('/api/plant', routerPlant.start());
app.use('/api/dailyWork', routerDailyWork.start());




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


