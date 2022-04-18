import { v4 as uuid } from 'uuid';
import { ApiSchedule } from './api/schedules.js';
import { ControllerSchedule } from './controllers/schedules.js';
import { loggerError, loggerInfo } from "./utils/logger.js";


const apiSchedule = new ApiSchedule();
const controllerSchedule = new ControllerSchedule();

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
        // socket.on("updateSchedule", ( date, newSchedule, roomId) => apiSchedule.updateSchedule(date, newSchedule, roomId, socket));
        socket.on("updateSchedule", (date, newSchedule, roomId) => apiSchedule.handleSocket({ date, socket, action: "updateSchedule", newSchedule, roomId }));
        socket.on("updateScheduleColumns", (roomId, date, newColumns) => apiSchedule.updateScheduleColumns(roomId, date, newColumns, socket));







        socket.on("disconnect", () => {
            loggerInfo.info(`Socket ${socket.id} disconnected`);
        });
    });
}
