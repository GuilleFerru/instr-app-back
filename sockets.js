// import { v4 as uuid } from 'uuid';
import { ApiSchedule } from './api/schedules.js';
import {ApiDailyWork} from './api/dailyWorks.js';
import { loggerError, loggerInfo } from "./utils/logger.js";


const apiSchedule = new ApiSchedule();
const apiDailyWork = new ApiDailyWork();
// const controllerSchedule = new ControllerSchedule();

export default (io) => {

    io.on("connection", async (socket) => {
        loggerInfo.info(`Socket ${socket.id} connected`);

        const sockets = await io.fetchSockets()
        console.log('List of connected sockets:')
        sockets.forEach(socket => {
            console.log(socket.id)
        });

        // SCHEDULES
        socket.on("getSchedule", (date) => apiSchedule.handleSocket({ date, socket, action: "getSchedule" }));
        socket.on("scheduleRoom", (id) => {
            socket.join(id)
            loggerInfo.info(`Socket ${socket.id} joined room ${id}`);
            loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("leaveScheduleRoom", (id) => {
            socket.leave(id)
            socket.to(id).emit("leaveScheduleRoom", id);
            loggerInfo.info(`Socket ${socket.id} left room ${id}`);
        })
        socket.on("updateSchedule", (date, newSchedule, roomId) => apiSchedule.handleSocket({ date, socket, action: "updateSchedule", newSchedule, roomId }));
        socket.on("updateScheduleColumns", (date, newColumns, roomId, aditionalCount) => apiSchedule.handleSocket({ date, socket, action: "updateScheduleColumns", newColumns, roomId, io, aditionalCount }));

        // DAILY WORKS
        socket.on("getDailyWorks", (date) => apiDailyWork.handleSocket({ date, socket, action: "getDailyWorks" }));





        socket.on("disconnect", () => {
            loggerInfo.info(`Socket ${socket.id} disconnected`);
        });
    });
}
