// import { v4 as uuid } from 'uuid';
import { ApiSchedule } from './api/schedules.js';
import { ApiDailyWork } from './api/dailyWorks.js';
import { formatDate } from './utils/formatDate.js';
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
            loggerInfo.info(`Socket ${socket.id} joined Schedules room ${id}`);
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
        socket.on("get_daily_works", (date) => apiDailyWork.handleSocket({ date, socket, action: "get_daily_works" }));
        socket.on("create_daily_work", (dailyWorkData, roomId) => apiDailyWork.handleSocket({ socket, action: "create_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("daily_works_join_room", (date) => {
            const id = formatDate(date);
            socket.join(id)
            loggerInfo.info(`Socket ${socket.id} joined Daily Works room ${id}`);
            loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("daily_works_leave_room", (date) => {
            const id = formatDate(date);
            socket.leave(id)
            socket.to(id).emit("daily_works_leave_room", id);
            loggerInfo.info(`Socket ${socket.id} left Daily Works room ${id}`);
        })
        socket.on("update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "update_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("bulk_update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "bulk_update_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("delete_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "delete_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));




        socket.on("disconnect", () => {
            loggerInfo.info(`Socket ${socket.id} disconnected`);
        });
    });
}
