import express, { json } from "express";
import compression from 'compression';
import { config } from "dotenv";
import schedule from "node-schedule";
import helmet from "helmet";
import morgan from "morgan";
import DaoFactory from "./model/DAOs/DaoFactory.js";
import cors from "cors";
import * as router from "./utils/routersInstances.js";
import { loggerError, loggerInfo } from "./utils/logger.js";


export const app = express();

const port = process.env.PORT || 8080;
app.listen(port, () => { loggerInfo.info(`Servidor listo en el puerto ${port}`); });
app.on("error", (error) => { loggerError.error(error); });

config();
const daoInstance = DaoFactory.getInstance();
export const dao = daoInstance.get("mongo");

//middleware
app.use(compression());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(json());
// app.use(helmet());
app.use(morgan("common"));
app.use(cors());

// endpoints

app.use("/api/shift", router.routerShift.start());
app.use("/api/emp", router.routerEmployee.start());
app.use("/api/schedule", router.routerSchedule.start());
app.use("/api/timeSchedule", router.routerTimeSchedule.start());
app.use("/api/aditional", router.routerAditional.start());
app.use("/api/plant", router.routerPlant.start());
app.use("/api/dailyWork", router.routerDailyWork.start());
app.use("/api/attelier", router.routerAttelier.start());
app.use("/api/tag", router.routerTag.start());
app.use("/api/routine", router.routerRoutine.start());
app.use("/api/manteinance", router.routerManteinance.start());
app.use("/api/manteinanceAction", router.routerManteinanceAction.start());
app.use("/api/user", router.routerUser.start());
app.use("/api", router.routerLogin.start());


// app.use(passport.initialize());
// app.use(passport.session());


app.get("/", (req, res) => {
  res.send("Home Page");
});

import { ApiRoutine } from './api/routines.js';
const apiRoutine = new ApiRoutine();
//me crea todas las rutinas del mes, todos los meses a las 0:00 horas
schedule.scheduleJob("0 0 0 1 */1 *", () => {
  apiRoutine.createRoutineScheduleByNewMonth();
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
