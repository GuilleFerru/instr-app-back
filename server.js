import express, { json } from "express";
import passport from "passport";
import http from "http";
import { Server as WebSocketServer } from "socket.io";
import * as jwtAuth from 'socketio-jwt-auth';
import { userModel } from './model/models/Users.js';
import Sockets from './sockets.js'
import compression from 'compression';
import { config as dotEnvConfig } from "dotenv";
import config from "./config.js";
import schedule from "node-schedule";
import helmet from "helmet";
// import morgan from "morgan";
import cors from "cors";
import DaoFactory from "./model/DAOs/DaoFactory.js";
import * as router from "./utils/routersInstances.js";
import { loggerError, loggerInfo } from "./utils/logger.js";

export const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
export const httpServer = server.listen(port, () => { loggerInfo.info(`Servidor listo en el puerto ${port}`); });
server.on("error", (error) => { loggerError.error(error); });

dotEnvConfig();

export const io = new WebSocketServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["x-auth-token"],
    credentials: true
  }
});

io.use(jwtAuth.default.authenticate({
  secret: config.SECRET_KEY,
  algorithm: 'HS256',
}, (payload, done) => {
  if (payload) {
    userModel.findOne({ _id: payload.id }, (err, user) => {
      if (err) {
        // return error
        return done(err);
      }
      if (!user) {
        // return fail with an error message
        return done(null, false, 'user does not exist');
      }
      // return success with a user info
      return done(null, user);
    });
  } else {
    return done()
  }
}
))
Sockets(io);


const daoInstance = DaoFactory.getInstance();
export const dao = daoInstance.get("mongo");

//middleware
app.use(passport.initialize());
app.use(compression());
//app.use(json());
app.use(json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(helmet());
// app.use(morgan("dev"));
const corsOptions = {
  origin: "http://localhost:8080/",
  optionsSuccessStatus: 200,
  method: "GET, PUT, POST, DELETE",
};
app.use(cors());
app.options('*', cors());

//app.use(express.json({limit: '25mb'}));
//app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 50000 }))

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
app.use("/api/plantShutdown", router.routerPlantShutdown.start());
app.use("/api/dashboard", router.routerDashboard.start());
app.use("/api/holidays", router.routerHoliday.start());
app.use("/api/store", router.routerStore.start());


app.get("/", (_req, res) => {
  res.send("");
});

import { ApiRoutine } from './api/routines.js';
const apiRoutine = new ApiRoutine();
//me crea todas las rutinas del mes, todos los meses a las 0:00 horas
schedule.scheduleJob("0 0 0 1 */1 *", () => {
  apiRoutine.createRoutineScheduleByNewMonth();
})
//apiRoutine.createRoutineScheduleByNewMonth();